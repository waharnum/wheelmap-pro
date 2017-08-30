import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { sortBy } from 'lodash';

import { Apps } from '../apps/apps';
import { isAdmin } from '../../lib/is-admin';
import { Sources } from '../sources/sources';
import { OrganizationMembers } from '../organization-members/organization-members';
import { userHasFullAccessToOrganizationId, isUserMemberOfOrganizationWithId } from '../organizations/privileges';

const ACCESS_REQUEST_APPROVING_ROLES = [
  'developer',
  'manager',
  'founder',
  'member',
];

export interface IHelpers {
  editableBy: (userId: Mongo.ObjectID) => boolean;
  isFullyVisibleForUserId: (userId: Mongo.ObjectID) => boolean;
  getSources: () => any[];
  getApps: () => any[];
  getMostAuthoritativeUserThatCanApproveAccessRequests: () => any[];
}

export const Helpers = {
  editableBy(userId: Mongo.ObjectID) {
    console.log('editableBy', userId);
    if (!userId) { return false; };
    check(userId, String);
    return userHasFullAccessToOrganizationId(userId, this._id);
  },
  isFullyVisibleForUserId(userId: Mongo.ObjectID) {
    if (!userId) { return false; };
    return isAdmin(userId) || isUserMemberOfOrganizationWithId(userId, this._id);
  },
  getSources() {
    const sources = Sources.find({ organizationId: this._id }).fetch();
    return sortBy(sortBy(sources, (s) => -s.placeInfoCount), 'isDraft');
  },
  getApps() {
    return Apps.find({ organizationId: this._id });
  },
  getMostAuthoritativeUserThatCanApproveAccessRequests() {
    for (const role of ACCESS_REQUEST_APPROVING_ROLES) {
      const result = OrganizationMembers.findOne({
        organizationId: this._id,
        role,
      });

      if (result) {
        return Meteor.users.findOne(result.userId);
      }
    }

    return null;
  },
};
