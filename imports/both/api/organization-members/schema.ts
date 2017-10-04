import SimpleSchema from 'simpl-schema';

import {roles} from './roles';
import {EmailInviteSchema} from '../../lib/invite-schema';
import {invitationStates} from './invitationStates';

// allow custom uniforms fields
SimpleSchema.extendOptions(['uniforms']);

export const OrganizationMemberSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  organizationId: {
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
    optional: true,
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
    optional: true,
    regEx: SimpleSchema.RegEx.Email,
  },
  role: {
    type: String,
    allowedValues: roles.map((v) => v.value),
  },
});

export const MemberInviteSchema = new SimpleSchema({
  'organizationId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
});

MemberInviteSchema.extend(EmailInviteSchema);
