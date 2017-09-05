import { insertDraftParticipant } from './_invitations';
import { EventParticipantInviteSchema } from '../schema';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Events } from '../../events/events';
import { userHasFullAccessToOrganization } from '../../organizations/privileges';
import { EventParticipants } from '../event-participants';
import { TAPi18n } from 'meteor/tap:i18n';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const insert = new ValidatedMethod({
  name: 'eventParticipants.invite',
  validate: EventParticipantInviteSchema.validator(),
  run({ invitationEmailAddresses, eventId }) {
    check(invitationEmailAddresses, [String]);
    check(eventId, String);

    console.log('Inviting', invitationEmailAddresses, 'to event', eventId, '...');

    if (!this.userId) {
      throw new Meteor.Error(401, TAPi18n.__('Please log in first.'));
    }

    const event = Events.findOne({ _id: eventId });
    if (!event) {
      throw new Meteor.Error(404, TAPi18n.__('Event not found'));
    }

    const organization = event.getOrganization();
    if (!organization) {
      throw new Meteor.Error(404, TAPi18n.__('Event does not belong to an existing organization'));
    }

    if (!userHasFullAccessToOrganization(this.userId, organization)) {
      throw new Meteor.Error(403,
        TAPi18n.__('You are not authorized to invite users to this organization.'));
    }

    // TODO: add actually sending emails when the state of the event is already past draft!

    return invitationEmailAddresses.map((address) => {
      return insertDraftParticipant(address, eventId);
    });
  },
});