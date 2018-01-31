import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import SimpleSchema from 'simpl-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';

import {IEvent, Events} from '../events';
import {EventParticipants} from '../../event-participants/event-participants';
import {IOrganization, Organizations} from '../../organizations/organizations';
import {sendEventInvitationEmailTo} from '../../event-participants/server/_invitations';
import {ISource, Sources} from '../../sources/sources';


export const createSourceForEvent = (organization: IOrganization, doc: IEvent): Mongo.ObjectID | null => {
  if (!doc.sourceId) {
    const newDoc = {
      organizationId: organization._id as Mongo.ObjectID,
      name: `Event source ${doc.name}`,
      shortName: 'Event source',
      licenseId: 'R6Lneq4ZL2uMausHZ' as any as Mongo.ObjectID, // hard coded osm license
      streamChain: [],
      accessRestrictedTo: [],
      isRequestable: true,
      isFreelyAccessible: false,
      isDraft: false,
      placeInfoCount: 0,
    };

    const sourceId = Sources.insert(newDoc as any as ISource);
    return sourceId as any as Mongo.ObjectID;
  }
  return null;
};

export const insert = new ValidatedMethod({
  name: 'events.insert',
  validate: Events.schema.validator(),
  run(doc: IEvent) {

    const organization = Organizations.findOne(doc.organizationId);
    if (!organization) {
      throw new Meteor.Error(404, 'Organization for event not found.');
    }
    if (!organization.editableBy(this.userId)) {
      throw new Meteor.Error(403, 'You don\'t have permission to create an event for this organization.');
    }

    // assign invitation token
    doc.invitationToken = Random.secret();
    // ensure nobody can force a source from the outside
    delete doc.sourceId;
    // create the source for this event
    const sourceIdSet = createSourceForEvent(organization, doc);
    if (sourceIdSet) {
      doc.sourceId = sourceIdSet;
    }

    return Events.insert(doc);
  },
});

export const remove = new ValidatedMethod({
  name: 'events.remove',
  validate: new SimpleSchema({
    eventId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  run({eventId}) {
    const event = Events.findOne(eventId);

    if (!event) {
      throw new Meteor.Error(404, 'Event not found.');
    }
    if (!event.editableBy(this.userId)) {
      throw new Meteor.Error(403, 'You don\'t have permission to remove this event.');
    }
    if (event.sourceId) {
      // TODO remove all places as well???
      // Sources.remove(event.sourceId);
    }
    Events.remove(eventId);
  },
});

export const publish = new ValidatedMethod({
  name: 'events.publish',
  validate: new SimpleSchema({
    eventId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  run({eventId}) {
    const event = Events.findOne(eventId);

    if (!event) {
      throw new Meteor.Error(404, 'Event not found.');
    }
    if (!event.editableBy(this.userId)) {
      throw new Meteor.Error(403, 'You don\'t have permission to publish this event.');
    }
    if (event.status !== 'draft' && event.status !== 'canceled') {
      throw new Meteor.Error(403, 'This event is already published.');
    }

    const organization = Organizations.findOne(event.organizationId);
    Events.update(eventId, {$set: {status: 'planned'}});

    EventParticipants.find({invitationState: 'draft', eventId}).forEach((invitation) => {
      console.log('Publishing!', invitation._id);
      sendEventInvitationEmailTo(invitation, event, organization);
    });
  },
});

export const start = new ValidatedMethod({
  name: 'events.start',
  validate: new SimpleSchema({
    eventId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  run({eventId}) {
    const event = Events.findOne(eventId);

    if (!event) {
      throw new Meteor.Error(404, 'Event not found.');
    }
    if (!event.editableBy(this.userId)) {
      throw new Meteor.Error(403, 'You don\'t have permission to start this event.');
    }

    Events.update(eventId, {$set: {status: 'ongoing'}});
  },
});

export const complete = new ValidatedMethod({
  name: 'events.complete',
  validate: new SimpleSchema({
    eventId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  run({eventId}) {
    const event = Events.findOne(eventId);

    if (!event) {
      throw new Meteor.Error(404, 'Event not found.');
    }
    if (!event.editableBy(this.userId)) {
      throw new Meteor.Error(403, 'You don\'t have permission to complete this event.');
    }

    Events.update(eventId, {$set: {status: 'completed'}});
  },
});

export const cancel = new ValidatedMethod({
  name: 'events.cancel',
  validate: new SimpleSchema({
    eventId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  run({eventId}) {
    const event = Events.findOne(eventId);

    if (!event) {
      throw new Meteor.Error(404, 'Event not found.');
    }
    if (!event.editableBy(this.userId)) {
      throw new Meteor.Error(403, 'You don\'t have permission to cancel this event.');
    }
    if (event.status === 'canceled') {
      throw new Meteor.Error(403, 'This event is already canceled.');
    }

    Events.update(eventId, {$set: {status: 'canceled'}});

    // TODO sent email about cancelled event
  },
});
