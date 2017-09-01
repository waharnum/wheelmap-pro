import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { sortBy } from 'lodash';

import { Apps } from '../apps/apps';
import {isAdmin} from '../../lib/is-admin';
import { Sources } from '../sources/sources';
import {IEvent, Events} from '../events/events';
import { OrganizationMembers } from '../organization-members/organization-members';
import { userHasFullAccessToOrganizationId, isUserMemberOfOrganizationWithId } from '../organizations/privileges';

const ACCESS_REQUEST_APPROVING_ROLES = [
  'developer',
  'manager',
  'founder',
  'member',
];

export interface IOrganizationMixin {
  editableBy: (userId: Mongo.ObjectID) => boolean;
  isFullyVisibleForUserId: (userId: Mongo.ObjectID) => boolean;
  getEvents: () => IEvent[];
  // TODO: Use correct type once Sources has been ported
  getSources: () => any[];
  // TODO: Use correct type once App has been ported
  getApps: () => any[];
  getMostAuthoritativeUserThatCanApproveAccessRequests: () => any[];
}

export const OrganizationMixin = {
  editableBy(userId: Mongo.ObjectID): boolean {
    if (!userId) { return false; };
    return userHasFullAccessToOrganizationId(userId, this._id);
  },
  isFullyVisibleForUserId(userId: Mongo.ObjectID): boolean {
    if (!userId) { return false; };
    return isAdmin(userId) || isUserMemberOfOrganizationWithId(userId, this._id);
  },
  getEvents() {
    const events = Events.find({ organizationId: this._id }).fetch();
    return events;
  },
  getSources() {
    const sources = Sources.find({ organizationId: this._id }).fetch();
    return sortBy(sortBy(sources, (s) => -s.placeInfoCount), 'isDraft');
  },
  getApps() {
    return Apps.find({ organizationId: this._id }).fetch();
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
