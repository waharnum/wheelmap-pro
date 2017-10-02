import SimpleSchema from 'simpl-schema';
import {t} from 'c-3po';

// allow custom uniforms fields
SimpleSchema.extendOptions(['uniforms']);

export const EmailInviteSchema = new SimpleSchema({
  'invitationEmailAddresses': {
    type: Array,
    minCount: 1,
    maxCount: 10,
    label: t`Email Addresses`,
  },
  'invitationEmailAddresses.$': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: t`Email Address`,
    uniforms: {
      placeholder: t`e.g. lisa@example.com`,
    },
  },
});
