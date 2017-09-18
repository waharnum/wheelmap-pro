import {Mongo} from 'meteor/mongo';

import {EventParticipants, IEventParticipant} from '../event-participants/event-participants';
import {IOrganization, Organizations} from '../organizations/organizations';
import {userHasFullAccessToReferencedOrganization} from '../organizations/privileges';

export interface IEventMixin {
  getOrganization: () => IOrganization;
  getParticipants: () => IEventParticipant[];
  editableBy: (userId: Mongo.ObjectID) => boolean;
}

export const EventMixin = {
  getOrganization(): IOrganization {
    return Organizations.findOne(this.organizationId);
  },
  getParticipants(): IEventParticipant[] {
    return EventParticipants.find({eventId: {$in: [this._id]}}).fetch();
  },
  editableBy(userId: Mongo.ObjectID): boolean {
    if (!userId) {
      return false;
    }
    return userHasFullAccessToReferencedOrganization(userId, this);
  },
} as IEventMixin;
