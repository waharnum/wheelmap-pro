import SimpleSchema from 'simpl-schema';

// allow custom uniforms fields
SimpleSchema.extendOptions(['uniforms']);

const customUserIdFunction = () => {
  if (this.field('invitationEmailAddress')) {
    return null;
  }
  if (!this.operator) { // inserts
    if (!this.isSet || this.value === null || this.value === '') { return 'required'; };
  } else if (this.isSet) { // updates
    if (this.operator === '$set' && this.value === null || this.value === '') { return 'required'; };
    if (this.operator === '$unset') { return 'required'; };
    if (this.operator === '$rename') { return 'required'; };
  }
  return null;
};

export const EventParticipantSchema = new SimpleSchema({
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  gravatarHash: {
    type: String,
    optional: true,
  },
  invitationState: {
    type: String,
    optional: true,
    allowedValues: ['queuedForSending', 'sent', 'accepted', 'error'],
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
    optional: true,
    regEx: SimpleSchema.RegEx.Email,
  },
});

export const EventParticipantInviteSchema = new SimpleSchema({
  'eventId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  'invitationEmailAddresses': {
    type: Array,
    minCount: 1,
    maxCount: 10,
    label: 'Email Addresses',
  },
  'invitationEmailAddresses.$': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: 'Email Address',
    uniforms: {
      placeholder: 'e.g. lisa@example.com',
    },
  },
});
