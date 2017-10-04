import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import {t} from 'c-3po';
import {Sources} from '../sources';
import {Organizations} from '../../organizations/organizations';
import {Apps} from '../../apps/apps';
import {
  getAccessibleOrganizationIdsForUserId,
  userHasFullAccessToReferencedOrganization,
  userHasFullAccessToOrganizationId,
} from '../../organizations/privileges';

Sources.allow({
  insert: userHasFullAccessToReferencedOrganization,
  update: userHasFullAccessToReferencedOrganization,
  remove: userHasFullAccessToReferencedOrganization,
});

Sources.helpers({
  editableBy(userId) {
    check(userId, String);
    return userHasFullAccessToReferencedOrganization(userId, this);
  },
});

Sources.deny({
  update(userId, source, fields) {
    // Don't allow to change this flag on the client
    return fields.includes('hasRunningImport');
  },
});

function sourceSelectorForOrganizationIds(organizationIds) {
  check(organizationIds, [String]);

  const otherOrganizationIdsWithAcceptedToS = Organizations.find(
    {tocForOrganizationsAccepted: true},
    {fields: {_id: 1}},
  ).map(organization => organization._id);

  return {
    $or: [
      // match sources of my own organizations
      {organizationId: {$in: organizationIds}},
      // match published freely accessible sources of other organizations that have accepted ToS
      {
        isDraft: false,
        isFreelyAccessible: true,
        organizationId: {$in: otherOrganizationIdsWithAcceptedToS},
      },
      // match published restricted-access sources of other organizations that have accepted ToS
      {
        isDraft: false,
        isFreelyAccessible: false,
        organizationId: {$in: otherOrganizationIdsWithAcceptedToS},
        accessRestrictedTo: {$elemMatch: {$in: organizationIds}},
      },
    ],
  };
}

export const visibleSelectorForUserId = (userId) => {
  check(userId, Match.Maybe(String));
  return sourceSelectorForOrganizationIds(getAccessibleOrganizationIdsForUserId(userId));
};

export const visibleSelectorForAppId = (appId) => {
  check(appId, String);
  const app = Apps.findOne(appId);
  const organizationId = app.organizationId;
  return {$and: [sourceSelectorForOrganizationIds([organizationId]), {isDraft: false}]};
};

export const apiParameterizedSelector = selector => selector;

export function checkExistenceAndFullAccessToSourceId(userId, sourceId) {
  check(sourceId, String);
  check(userId, String);

  if (!userId) {
    throw new Meteor.Error(401, t`Please log in first.`);
  }

  const source = Sources.findOne({_id: sourceId});
  if (!source) {
    throw new Meteor.Error(404, t`Source not found.`);
  }

  if (!userHasFullAccessToOrganizationId(userId, source.organizationId)) {
    throw new Meteor.Error(401, t`Not authorized.`);
  }

  return source;
}

export function checkExistenceAndVisibilityForSourceId(userId, sourceId) {
  check(sourceId, String);
  check(userId, String);

  if (!userId) {
    throw new Meteor.Error(401, t`Please log in first.`);
  }

  const source = Sources.findOne({
    $and: [
      visibleSelectorForUserId(userId),
      {_id: sourceId},
    ],
  });
  if (!source) {
    throw new Meteor.Error(404, t`Source not found or not visible.`);
  }

  return source;
}
