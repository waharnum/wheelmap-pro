import { EventParticipants, IEventParticipant } from '../event-participants';

import { Random } from 'meteor/random';
import { getGravatarHashForEmailAddress } from '../../../lib/user-icon';

export function insertDraftParticipant(emailAddress: string, eventId: Mongo.ObjectID): IEventParticipant {
  const participant = {
    eventId,
    userId: null, // empty as not existing when invited
    invitationToken: Random.secret(),
    invitationEmailAddress: emailAddress,
    invitationState: 'draft',
    gravatarHash: getGravatarHashForEmailAddress(emailAddress),
  } as IEventParticipant;

  const id = EventParticipants.insert(participant);
  return EventParticipants.findOne(id);
}