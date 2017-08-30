import { Apps } from '../../apps/apps';
import { getAccessibleOrganizationIdsForUserId } from '../../organizations/privileges';

export const OrganizationMembersPublicFields = {
  organizationId: 1,
  userId: 1,
  role: 1,
  invitationState: 1,
  invitationError: 1,
  invitationEmailAddress: 1,
  gravatarHash: 1,
};

export const OrganizationMemberVisibleForUserIdSelector = (userId: Mongo.ObjectID) => {
  if (!userId) {
    return null;
  }
  return {
    organizationId: { $in: getAccessibleOrganizationIdsForUserId(userId) },
  };
};

export const OrganizationVisibleForUserIdSelector = (userId: Mongo.ObjectID) => {
  if (!userId) {
    return null;
  }
  return {
    _id: { $in: getAccessibleOrganizationIdsForUserId(userId) },
  };
};

export const OrganizationMembersVisibleForAppIdSelector = (appId: Mongo.ObjectID) => {
  const app = Apps.findOne(appId);
  return { organizationId: app.organizationId };
};
