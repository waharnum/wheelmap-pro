import SimpleSchema from 'simpl-schema';
import { roles } from './roles';

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

export const OrganizationMemberSchema = new SimpleSchema({
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
  role: {
    type: String,
    allowedValues: roles.map((v) => v.value),
  },
});
