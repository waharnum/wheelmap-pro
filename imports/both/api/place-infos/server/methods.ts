import {Meteor} from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import {IPlaceInfo, PlaceInfos} from '../place-infos';
import {PlaceInfoSchema} from '@sozialhelden/ac-format';
import {t} from 'c-3po';
import {userIsAllowedToMapInEventId} from '../../events/priviledges';

export const insert = new ValidatedMethod({
  name: 'placeInfos.insertForEvent',
  validate: new SimpleSchema({
    eventId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    place: {
      type: PlaceInfoSchema,
    },
  }).validator(),
  run(doc: { eventId: Mongo.ObjectID, place: IPlaceInfo }) {
    console.log('Inserting place', doc.place, 'for user id', this.userId);

    if (!this.userId) {
      throw new Meteor.Error(401, t`Please log in first.`);
    }
    if (!userIsAllowedToMapInEventId(this.userId, doc.eventId)) {
      throw new Meteor.Error(403, t`You do not have rights to add places for this event.`);
    }

    // TODO fetch or create source for event id

    // TODO store user id with place

    (doc.place as any)._testing = true;

    return PlaceInfos.insert(doc.place);
  },
});
