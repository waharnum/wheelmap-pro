
import { map } from 'lodash';
import { uniq } from 'lodash';
import { compact } from 'lodash';

import { Apps } from '../../apps/apps';
import { OrganizationMembers } from '../../organization-members/organization-members';
import { OrganizationMemberVisibleForUserIdSelector } from '../../organization-members/server/fields';

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
    { fields: { userId: 1 }, transform: null },
  ).fetch();
  return { _id: { $in: compact(uniq(map(members, ((m) => m.userId)))) } };
}

export const UserVisibleSelectorForUserId = (userId) => {
  check(userId, String);
  getUserSelectorForMemberSelector(OrganizationMemberVisibleForUserIdSelector(userId));
};

export const UserVisibleSelectorForAppId = (appId) => {
  check(appId, String);
  const app = Apps.findOne(appId);
  return getUserSelectorForMemberSelector({ organizationId: app.organizationId });
};
