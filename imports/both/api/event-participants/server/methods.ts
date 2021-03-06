import {check} from 'meteor/check';
import {Meteor} from 'meteor/meteor';
import {t} from 'c-3po';
import {ValidatedMethod} from 'meteor/mdg:validated-method';

import {Events} from '../../events/events';
import {Organizations} from '../../organizations/organizations';
import {EventParticipants} from '../event-participants';
import {userHasFullAccessToOrganizationId} from '../../organizations/privileges';
import {EventInviteSchema, EventParticipantSchema} from '../schema';
import {
  insertDraftEventParticipant, sendEventInvitationEmailTo, acceptEventInvitation,
  acceptPublicEventInvitation,
} from './_invitations';

export const insert = new ValidatedMethod({
  name: 'eventParticipants.invite',
  validate: EventInviteSchema.validator(),
  run({invitationEmailAddresses, eventId}) {
    check(invitationEmailAddresses, [String]);
    check(eventId, String);

    console.log('Inviting', invitationEmailAddresses, 'to event', eventId, '...');

    if (!this.userId) {
      throw new Meteor.Error(401, t`Please log in first.`);
    }

    const event = Events.findOne({_id: eventId});
    if (!event) {
      throw new Meteor.Error(404, t`Event not found`);
    }

    if (!userHasFullAccessToOrganizationId(this.userId, event.organizationId)) {
      throw new Meteor.Error(403,
        t`You are not authorized to invite users to this organization.`);
    }

    const organization = Organizations.findOne({_id: event.organizationId});
    if (!organization) {
      throw new Meteor.Error(404, t`Organization not found`);
    }

    return invitationEmailAddresses.map((invitationEmailAddress) => {
      // make sure we do not insert an existing user again
      const existing = EventParticipants.findOne({eventId, invitationEmailAddress});
      if (existing) {
        return existing._id;
      }
      const inserted = insertDraftEventParticipant(invitationEmailAddress, eventId);

      // only send emails if the state of the event is already past draft
      if (event.status !== 'draft') {
        sendEventInvitationEmailTo(inserted, event, organization);
      }

      return inserted._id;
    });
  },
});

export const accept = new ValidatedMethod({
  name: 'eventParticipants.acceptInvitation',
  validate: EventParticipantSchema.pick('eventId', 'invitationToken').validator(),
  run({eventId, invitationToken}) {
    check(eventId, String);
    check(invitationToken, String);

    if (!this.userId) {
      throw new Meteor.Error(401, t`Please log in first.`);
    }

    const event = Events.findOne({_id: eventId});

    if (!event) {
      throw new Meteor.Error(404, t`Event not found`);
    }

    return acceptEventInvitation(this.userId, eventId, invitationToken);
  },
});

export const acceptPublic = new ValidatedMethod({
  name: 'eventParticipants.acceptPublicInvitation',
  validate: EventParticipantSchema.pick('eventId', 'invitationToken').validator(),
  run({eventId, invitationToken}) {
    check(eventId, String);
    check(invitationToken, String);

    if (!this.userId) {
      throw new Meteor.Error(401, t`Please log in first.`);
    }

    const event = Events.findOne({_id: eventId});

    if (!event) {
      throw new Meteor.Error(404, t`Event not found`);
    }

    return acceptPublicEventInvitation(this.userId, eventId, invitationToken);
  },
});

Meteor.methods({
  'eventParticipants.remove'(participantUserId: Mongo.ObjectID) {
    check(participantUserId, String);

    if (!this.userId) {
      throw new Meteor.Error(401, t`Please log in first.`);
    }

    const eventParticipant = EventParticipants.findOne(participantUserId);
    if (!eventParticipant) {
      throw new Meteor.Error(404, t`Event participants not found`);
    }

    const event = Events.findOne({_id: eventParticipant.eventId});
    if (!event) {
      throw new Meteor.Error(404, t`Event not found`);
    }

    const isOwnParticipation = eventParticipant.userId === this.userId;

    const isAuthorized = isOwnParticipation || userHasFullAccessToOrganizationId(this.userId, event.organizationId);
    if (!isAuthorized) {
      throw new Meteor.Error(403, t`Not authorized.`);
    }

    return EventParticipants.remove(participantUserId);
  },
});
