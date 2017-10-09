import SimpleSchema from 'simpl-schema';
import {t} from 'c-3po';
import {EmailInviteSchema} from '../../lib/invite-schema';
import {invitationStates} from './invitationStates';

// allow custom uniforms fields
SimpleSchema.extendOptions(['uniforms']);

export const EventParticipantSchema = new SimpleSchema({
  eventId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  gravatarHash: {
    type: String,
    optional: true,
  },
  invitationState: {
    type: String,
    allowedValues: invitationStates.map((v) => v.value),
  },
  invitationError: {
    type: String,
    optional: true,
  },
  invitationToken: {
    type: String,
    optional: true,
  },
  invitationEmailAddress: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true, // optional for users joining via public link
  },
});

export const EventInviteSchema = new SimpleSchema({
  'eventId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
});

EventInviteSchema.extend(EmailInviteSchema);
