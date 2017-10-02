import {Apps} from '../../apps/apps';
import {check} from 'meteor/check';
import {intersection} from 'lodash';
import {getAccessibleOrganizationIdsForUserId} from '../../organizations/privileges';

export const OrganizationMembersPrivateFields = {
  organizationId: 1,
  userId: 1,
  role: 1,
  invitationState: 1,
  invitationError: 1,
  invitationEmailAddress: 1,
  gravatarHash: 1,
};

export const OrganizationMembersPublicFields = {
  organizationId: 1,
  userId: 1,
  invitationState: 1,
  invitationToken: 1, // need to publish the token here, so that the client can find it again
};

// all members that the given userId can see
export function OrganizationMemberVisibleForUserIdSelector(userId: Mongo.ObjectID): Mongo.Selector | null {
  if (!userId) {
    return null;
  }
  return {
    organizationId: {$in: getAccessibleOrganizationIdsForUserId(userId)},
  };
};

export function OrganizationMemberByIdVisibleForUserIdSelector(userId: Mongo.ObjectID, organizationId: Mongo.ObjectID): Mongo.Selector | null {
  if (!userId) {
    return null;
  }
  // always sanitize to ensure no injection is possible from params (e.g. sending {$ne: -1} as an object)
  check(organizationId, String);

  return {
    organizationId: {$in: intersection(getAccessibleOrganizationIdsForUserId(userId), [organizationId])},
  };
};

// all organizations that the given userId can see
export function OrganizationVisibleForUserIdSelector(userId: Mongo.ObjectID): Mongo.Selector | null {
  if (!userId) {
    return null;
  }
  return {
    _id: {$in: getAccessibleOrganizationIdsForUserId(userId)},
  };
};

export function OrganizationMemberVisibleForAppIdSelector(appId: Mongo.ObjectID): Mongo.Selector {
  const app = Apps.findOne(appId);
  return {organizationId: app.organizationId};
};

export function buildByOrganizationIdAndTokenSelector(userId: Mongo.ObjectID,
                                                      organizationId: Mongo.ObjectID,
                                                      params: { token: string }): Mongo.Selector {

  // always sanitize to ensure no injection is possible from params (e.g. sending {$ne: -1} as an object)
  check(params.token, String);
  check(organizationId, String);

  return {
    $or: [
      {organizationId, invitationToken: params.token},
      {organizationId, userId: userId ? userId : -1}],
  };
};
