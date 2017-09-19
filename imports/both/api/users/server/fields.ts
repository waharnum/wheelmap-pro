import {map} from 'lodash';
import {uniq} from 'lodash';
import {compact} from 'lodash';

import {Apps} from '../../apps/apps';
import {OrganizationMembers} from '../../organization-members/organization-members';
import {getActiveOrganizationId} from '../../organizations/organizations';
import {OrganizationMemberVisibleForUserIdSelector} from '../../organization-members/server/fields';
import {EventParticipants} from '../../event-participants/event-participants';
import {buildVisibleForUserSelector} from '../../event-participants/server/_fields';

export const UserPrivateFields = {
  'username': 1,
  'guest': 1,
  'emails.address': 1,
  'services.facebook.id': 1,
  'services.google.picture': 1,
  'services.twitter.profile_image_url_https': 1,
  'profile.gravatarHash': 1,
};

function getUserSelectorForMemberSelector(selector: Mongo.Selector | null): Mongo.Selector | null {
  if (!selector) {
    return null;
  }

  const members = OrganizationMembers.find(
    selector,
    {fields: {userId: 1}},
  ).fetch();
  return {_id: {$in: compact(uniq(map(members, ((m) => m.userId))))}};
}

function getUserSelectorForParticipantSelector(selector: Mongo.Selector | null): Mongo.Selector | null {
  if (!selector) {
    return null;
  }

  const participants = EventParticipants.find(
    selector,
    {fields: {userId: 1}},
  ).fetch();
  return {_id: {$in: compact(uniq(map(participants, ((p) => p.userId))))}};
}

export const UserVisibleSelectorForUserIdSelector = (userId: Mongo.ObjectID): Mongo.Selector | null => {
  return {
    $or: [
      getUserSelectorForMemberSelector(OrganizationMemberVisibleForUserIdSelector(userId)),
      getUserSelectorForParticipantSelector(buildVisibleForUserSelector(userId)),
      {_id: userId},
    ],
  };
};

export const UserVisibleSelectorForAppIdSelector = (appId: Mongo.ObjectID): Mongo.Selector | null => {
  const app = Apps.findOne(appId);
  return getUserSelectorForMemberSelector({organizationId: app.organizationId});
};

export const ActiveOrganizationForUserIdSelector = (userId: Mongo.ObjectID): Mongo.Selector | null => {
  if (!userId) {
    return null;
  }

  const organizationId = getActiveOrganizationId(userId);
  return {
    _id: {$in: [organizationId]},
  };
};
