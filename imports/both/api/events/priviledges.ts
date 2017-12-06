import {isAdmin} from '../../../../imports/both/lib/is-admin';
import {userHasFullAccessToReferencedOrganization} from '../organizations/privileges';
import {Events} from './events';
import {check} from 'meteor/check';
import {EventParticipants} from '../event-participants/event-participants';

export function userIsEventParticipant(userId: string | undefined,
                                       eventId: Mongo.ObjectID | undefined): boolean {
  if (!userId || !eventId) {
    return false;
  }

  return EventParticipants.find({userId, eventId, invitationState: 'accepted'},
    {fields: {_id: 1}}).count() >= 1;
}

export function userIsAllowedToMapInEventId(userId: string | undefined,
                                            eventId: Mongo.ObjectID | undefined): boolean {
  if (!userId || !eventId) {
    return false;
  }
  check(userId, String);
  check(eventId, String);

  return isAdmin(userId) ||
    userIsEventParticipant(userId, eventId) ||
    userHasFullAccessToReferencedOrganization(userId, Events.findOne(eventId));
}
