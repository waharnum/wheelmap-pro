import { uniq } from 'lodash';

import { isAdmin } from '../../../lib/is-admin';
import { getAccessibleOrganizationIdsForUserId } from '../../organizations/privileges';
export const EventsPrivateFields = {
  organizationId: 1,
  name: 1,
  description: 1,
  regionName: 1,
  region: 1,
  startTime: 1,
  endTime: 1,
  webSiteUrl: 1,
  photoUrl: 1,
  invitationToken: 1,
  verifyGpsPositionsOfEdits: 1,
  targets: 1,
  status: 1,
  openFor: 1,
};

export function buildVisibleForUserByEventIdSelector(
  userId: Mongo.ObjectID, eventId: Mongo.ObjectID): Mongo.Selector | null {

  if (!userId) {
    return null;
  }

  // admins can see all events
  if (isAdmin(userId)) {
    return { eventId };
  }

  // get all the orgs a user can access
  const userOrganizationIds = getAccessibleOrganizationIdsForUserId(userId);
  // select the event, if the user is allowed to access with the organizations
  return {_id: eventId, organizationId: { $in: userOrganizationIds }};
};

export function buildVisibleForUserByOrganizationIdSelector(
  userId: Mongo.ObjectID, organizationId: Mongo.ObjectID): Mongo.Selector | null {

  if (!userId) {
    return null;
  }

  // admins can see all the participants of any event
  if (isAdmin(userId)) {
    return { organizationId };
  }

  // get all the orgs a user can access
  const userOrganizationIds = getAccessibleOrganizationIdsForUserId(userId);
  // select all the events the user is allowed to access with the organizations
  return {organizationId: { $in: userOrganizationIds }};
};
