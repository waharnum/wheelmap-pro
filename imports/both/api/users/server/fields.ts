
import { map } from 'lodash';
import { uniq } from 'lodash';
import { compact } from 'lodash';

import { Apps } from '../../apps/apps';
import { OrganizationMembers } from '../../organization-members/organization-members';
import { Organizations, getActiveOrganizationId } from '../../organizations/organizations';
import { OrganizationMemberVisibleForUserIdSelector } from '../../organization-members/server/fields';

// FIXME: this publishes ALL email addresses to all users!
export const UserPublicFields = {
  'emails.address': 1,
  'emails.verified': 1,
  'services.facebook.id': 1,
  'services.google.picture': 1,
  'services.twitter.profile_image_url_https': 1,
  'isApproved': 1,
  'isAdmin': 1,
  'profile': 1,
};

function getUserSelectorForMemberSelector(selector) {
  const members = OrganizationMembers.find(
    selector,
    { fields: { userId: 1 } },
  ).fetch();
  return { _id: { $in: compact(uniq(map(members, ((m) => m.userId)))) } };
}

export const UserVisibleSelectorForUserIdSelector = (userId: Mongo.ObjectID) => {
  getUserSelectorForMemberSelector(OrganizationMemberVisibleForUserIdSelector(userId));
};

export const UserVisibleSelectorForAppIdSelector = (appId: Mongo.ObjectID) => {
  const app = Apps.findOne(appId);
  return getUserSelectorForMemberSelector({ organizationId: app.organizationId });
};

export const ActiveOrganizationForUserIdSelector = (userId: Mongo.ObjectID) => {
  if (!userId) {
    return null;
  }

  const organizationId = getActiveOrganizationId(userId);
  return {
    _id: { $in: [organizationId] },
  };
};
