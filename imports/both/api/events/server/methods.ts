import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import SimpleSchema from 'simpl-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';

import {IEvent, Events} from '../events';

export const insert = new ValidatedMethod({
  name: 'events.insert',
  validate: Events.schema.validator(),
  run(doc: IEvent) {
    // assign invitation token
    doc.invitationToken = Random.secret();
    return Events.insert(doc);
  },
});

export const remove = new ValidatedMethod({
  name: 'events.remove',
  validate: new SimpleSchema({
    organizationId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  run({eventId}) {
    const event = Events.findOne(eventId);

    if (!event.editableBy(this.userId)) {
      throw new Meteor.Error(403, 'You don\'t have permission to remove this organization.');
    }
    Events.remove(eventId);
  },
});
