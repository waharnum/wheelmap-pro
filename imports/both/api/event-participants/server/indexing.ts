import { Meteor } from 'meteor/meteor';
import { EventParticipants } from '../event-participants';

Meteor.startup(() => {
  EventParticipants._ensureIndex({ eventId: 1 });
  EventParticipants._ensureIndex({ userId: 1 });
  EventParticipants._ensureIndex({ invitationToken: 1 });
  EventParticipants._ensureIndex({ invitationEmailAddress: 1 });

  EventParticipants._ensureIndex( { eventId: 1, invitationToken: 1 });
  EventParticipants._ensureIndex( { eventId: 1, invitationEmailAddress: 1 }, { unique: true });
});
