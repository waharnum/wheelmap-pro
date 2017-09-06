import { Events } from '../../events/events';
import { uniq } from 'lodash';

import { isAdmin } from '../../../lib/is-admin';
import { getAccessibleOrganizationIdsForUserId } from '../../organizations/privileges';
import { EventParticipants } from '../event-participants';

// make sure the invitationToken is omitted
export const EventParticipationPrivateFields = {
  eventId: 1,
  userId: 1,
  role: 1,
  invitationState: 1,
  invitationError: 1,
  invitationEmailAddress: 1,
  gravatarHash: 1,
};

export function buildVisibleForUserByEventIdSelector(
  userId: Mongo.ObjectID, eventId: Mongo.ObjectID): Mongo.Selector | null {

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
