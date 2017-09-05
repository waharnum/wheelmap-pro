import { Apps } from '../../apps/apps';
import { getAccessibleOrganizationIdsForUserId } from '../../organizations/privileges';

// FIXME: this is way too much public data, does not make any sense to publish
export const OrganizationMembersPublicFields = {
  organizationId: 1,
  userId: 1,
  role: 1,
  invitationState: 1,
  invitationError: 1,
  invitationEmailAddress: 1,
  gravatarHash: 1,
};

// all members that the given userId can see
export const OrganizationMemberVisibleForUserIdSelector = (userId: Mongo.ObjectID): Mongo.Selector | null => {
  if (!userId) {
    return null;
  }
  return {
    organizationId: { $in: getAccessibleOrganizationIdsForUserId(userId) },
  };
};

// all organizations that the given userId can see
export const OrganizationVisibleForUserIdSelector = (userId: Mongo.ObjectID): Mongo.Selector | null => {
  if (!userId) {
    return null;
  }
  return {
    _id: { $in: getAccessibleOrganizationIdsForUserId(userId) },
  };
};

// TODO: clarify what APP selectors are actually used for
export const OrganizationMembersVisibleForAppIdSelector = (appId: Mongo.ObjectID): Mongo.Selector => {
  const app = Apps.findOne(appId);
  return { organizationId: app.organizationId };
};
