import {Meteor} from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import {IPlaceInfo, PlaceInfos} from '../place-infos';
import {FormatVersion, PlaceInfo, PlaceInfoSchema} from '@sozialhelden/ac-format';
import {t} from 'c-3po';
import {userIsAllowedToMapInEventId} from '../../events/priviledges';
import {Events} from '../../events/events';
import {createSourceForEvent} from '../../events/server/methods';
import {Organization} from 'aws-sdk/clients/organizations';
import {Organizations} from '../../organizations/organizations';

const insertionSchema = new SimpleSchema({
  eventId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  place: {
    type: new SimpleSchema({
      '_id': {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true,
      },
      '_testing': {
        type: Boolean,
        optional: true,
      },
    }).extend(PlaceInfoSchema),
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

    const event = Events.findOne(doc.eventId);
    if (!event) {
      throw new Meteor.Error(404, 'Event not found.');
    }

    if (!event.sourceId) {
      const organization = Organizations.findOne(event.organizationId);
      if (!organization) {
        throw new Meteor.Error(404, 'Organization not found.');
      }
      const sourceId = createSourceForEvent(organization, event);
      if (sourceId) {
        event.sourceId = sourceId;
        Events.update(doc.eventId, {$set: {sourceId}});
      }
    }

    // source, user and event id with place
    doc.place.properties.eventId = String(doc.eventId);
    doc.place.properties.creatorId = this.userId;
    doc.place.properties.sourceId = String(event.sourceId);

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
