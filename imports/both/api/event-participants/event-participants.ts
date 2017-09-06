import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import { EventParticipantMixin, IEventParticipantMixin } from './mixins';
import { EventParticipantSchema } from './schema';

export interface IEventParticipant extends IEventParticipantMixin {
  // mongo id
  _id?: Mongo.ObjectID;
  // fields
  eventId: Mongo.ObjectID;
  userId: Mongo.ObjectID | null;
  gravatarHash?: string;
  invitationState: 'draft' | 'queuedForSending' | 'sent' | 'accepted' | 'error';
  invitationError?: string;
  invitationToken?: string;
  invitationEmailAddress: string;
};

export const EventParticipants = new Mongo.Collection<IEventParticipant>('EventParticipants');
EventParticipants.schema = EventParticipantSchema;
EventParticipants.attachSchema(EventParticipants.schema);
EventParticipants.helpers(EventParticipantMixin);
