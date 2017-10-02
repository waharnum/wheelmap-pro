import SimpleSchema from 'simpl-schema';
import {t} from 'c-3po';
import {registerSchemaForI18n} from '../i18n/i18n';

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

registerSchemaForI18n(EmailInviteSchema);
