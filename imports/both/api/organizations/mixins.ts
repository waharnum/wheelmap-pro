import {Mongo} from 'meteor/mongo';
import {sortBy} from 'lodash';

import {isAdmin} from '../../lib/is-admin';
import {ISource, Sources} from '../sources/sources';
import {IEvent, Events} from '../events/events';
import {IOrganizationMember, OrganizationMembers} from '../organization-members/organization-members';
import {userHasFullAccessToOrganizationId, isUserMemberOfOrganizationWithId} from './privileges';

const ACCESS_REQUEST_APPROVING_ROLES = [
  'developer',
  'manager',
  'founder',
  'member',
];

export interface IOrganizationMixin {
  editableBy: (userId: Mongo.ObjectID | string | null | undefined) => boolean;
  isFullyVisibleForUserId: (userId: Mongo.ObjectID) => boolean;
  getEvents: () => IEvent[];
  getMembers: () => IOrganizationMember[];
  getSources: () => ISource[];
  getMostAuthoritativeUserThatCanApproveAccessRequests: () => any[];
}

export const OrganizationMixin = {
  editableBy(userId: string | null | undefined): boolean {
    if (!userId) {
      return false;
    }
    return userHasFullAccessToOrganizationId(userId, this._id);
  },
  isFullyVisibleForUserId(userId: Mongo.ObjectID): boolean {
    console.log('isFullyVisibleForUserId', userId);

    if (!userId) {
      return false;
    }
    return isAdmin(userId) || isUserMemberOfOrganizationWithId(userId, this._id);
  },
  getEvents() {
    const events = Events.find({organizationId: this._id}).fetch();
    // sort by date - closest upcoming event first, older events sorted by time
    const current = Date.now();
    return events.sort((first: IEvent, second: IEvent) => {
      const diffFirst = current - (first.startTime ? first.startTime.getTime() : 0);
      const diffSecond = current - (second.startTime ? second.startTime.getTime() : 0);

      if (diffFirst > 0 && diffSecond < 0) {
        return 1;
      }
      if (diffFirst < 0 && diffSecond > 0) {
        return -1;
      }
      if (diffFirst > 0) {
        return diffFirst - diffSecond;
      }
      return diffSecond - diffFirst;
    });
  },
  getMembers() {
    return OrganizationMembers.find({organizationId: this._id}).fetch();
  },
  getSources() {
    const sources = Sources.find({organizationId: this._id}).fetch();
    return sortBy(sortBy(sources, (s) => -s.placeInfoCount), 'isDraft');
  },
  getMostAuthoritativeUserThatCanApproveAccessRequests(): Meteor.User | null {
    for (const role of ACCESS_REQUEST_APPROVING_ROLES) {
      const result = OrganizationMembers.findOne({
        organizationId: this._id,
        role,
      });

      if (result && result.userId) {
        return Meteor.users.findOne(result.userId);
      }
    }

    return null;
  },
} as IOrganizationMixin;
