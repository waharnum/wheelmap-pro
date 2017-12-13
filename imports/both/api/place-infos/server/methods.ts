import {Meteor} from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import {IPlaceInfo, PlaceInfos} from '../place-infos';
import {FormatVersion, PlaceInfo, PlaceInfoSchema} from '@sozialhelden/ac-format';
import {t} from 'c-3po';
import {userIsAllowedToMapInEventId} from '../../events/priviledges';

const insertionSchema = new SimpleSchema({
  eventId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  place: {
    type: PlaceInfoSchema.extend({
      '_id': {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true,
      },
      '_testing': {
        type: Boolean,
        optional: true,
      },
    }),
  },
});

export const insert = new ValidatedMethod({
  name: 'placeInfos.insertForEvent',
  validate: insertionSchema.validator(),
  run(doc: { eventId: Mongo.ObjectID, place: PlaceInfo & { _id: Mongo.ObjectID } }) {
    console.log('Inserting place', doc.place, 'for user id', this.userId);

    if (!this.userId) {
      throw new Meteor.Error(401, t`Please log in first.`);
    }
    if (!userIsAllowedToMapInEventId(this.userId, doc.eventId)) {
      throw new Meteor.Error(403, t`You do not have rights to add places for this event.`);
    }

    // TODO fetch or create source for event id

    (doc.place as any)._testing = true;

    // user and event id with place
    doc.place.properties.eventId = String(doc.eventId);
    doc.place.properties.creatorId = this.userId;

    doc.place.formatVersion = FormatVersion;

    if (doc.place._id) {
      const {_id, ...strippedDoc} = doc.place;
      PlaceInfos.update(doc.place._id, {$set: strippedDoc});
      return _id;
    } else {
      return PlaceInfos.insert(doc.place as any as IPlaceInfo);
    }
  },
});
