import { uniq } from 'lodash';
import { check } from 'meteor/check';

import { Events } from '../../events/events';
import { isAdmin } from '../../../lib/is-admin';
import { EventParticipants } from '../event-participants';
import { getAccessibleOrganizationIdsForUserId } from '../../organizations/privileges';

// make sure the invitationToken is omitted
export const EventParticipationPrivateFields = {
  eventId: 1,
  userId: 1,
  invitationState: 1,
  invitationError: 1,
  invitationEmailAddress: 1,
  gravatarHash: 1,
};

export const EventParticipationPublicFields = {
  eventId: 1,
  invitationState: 1,
  invitationToken: 1, // need to publish the token here, so that the client can find it again
};

export function buildVisibleForUserByEventIdSelector(
  userId: Mongo.ObjectID, eventId: Mongo.ObjectID): Mongo.Selector | null {

  // always sanitize to ensure no injection is possible from params (e.g. sending {$ne: -1} as an object)
  check(eventId, String);

  if (!userId) {
    return null;
  }

  // admins can see all the participants of any event
  if (isAdmin(userId)) {
    return { eventId };
  }

  // get all the orgs a user can access
  const userOrganizationIds = getAccessibleOrganizationIdsForUserId(userId);
  // select all the events the user is allowed to access with the organizations
  const eventSelector = {_id: eventId, organizationId: { $in: userOrganizationIds }};
  const userEventIds = uniq(Events
                      .find(eventSelector, { fields: { eventId: 1 } })
                      .fetch()
                      .map((entry) => entry._id));

  // now build the final selector
  const selector = { eventId: { $in: userEventIds } };
  return selector;
};

export function buildByEventIdAndTokenSelector(
  userId: Mongo.ObjectID, eventId: Mongo.ObjectID, params: {token: string}): Mongo.Selector | null {

  // always sanitize to ensure no injection is possible from params (e.g. sending {$ne: -1} as an object)
  check(params.token, String);
  check(eventId, String);
  return { eventId, invitationToken: params.token };
};