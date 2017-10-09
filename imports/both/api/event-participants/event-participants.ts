import {Mongo} from 'meteor/mongo';

import {EventParticipantMixin, IEventParticipantMixin} from './mixins';
import {EventParticipantSchema} from './schema';
import {InvitationStateType} from './invitationStates';

export interface IEventParticipant extends IEventParticipantMixin {
  // mongo id
  _id?: Mongo.ObjectID;
  // fields
  eventId: Mongo.ObjectID;
  userId: Mongo.ObjectID | null;
  gravatarHash?: string;
  invitationState: InvitationStateType;
  invitationError?: string;
  invitationToken?: string;
  invitationEmailAddress?: string;
};

export const EventParticipants = new Mongo.Collection<IEventParticipant>('EventParticipants');
EventParticipants.schema = EventParticipantSchema;
EventParticipants.attachSchema(EventParticipants.schema);
EventParticipants.helpers(EventParticipantMixin);
