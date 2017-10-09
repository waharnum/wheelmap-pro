import SimpleSchema from 'simpl-schema';
import {t} from 'c-3po';
import {registerSchemaForI18n} from '../../i18n/i18n';

// allow custom uniforms fields
SimpleSchema.extendOptions(['uniforms']);

export const OrganizationSchema = new SimpleSchema({
  name: {
    label: t`Name`,
    type: String,
    max: 1000,
    uniforms: {
      placeholder: 'e.g. Organization Name',
    },
  },
  description: {
    label: 'Description (optional)',
    type: String,
    max: 1000,
    optional: true,
    uniforms: {
      placeholder: 'e.g. Our organization is…',
    },
  },
  address: {
    label: 'Address',
    type: String,
    max: 1000,
    optional: true,
  },
  addressAdditional: {
    label: 'Address (Additional)',
    type: String,
    max: 1000,
    optional: true,
  },
  zipCode: {
    label: 'ZIP-Code',
    type: String,
    max: 1000,
    optional: true,
  },
  city: {
    label: 'City',
    type: String,
    optional: true,
    max: 100,
  },
  country: {
    label: 'Country',
    type: String,
    optional: true,
    max: 100,
  },
  phoneNumber: {
    label: 'Phone number',
    type: String,
    max: 100,
    optional: true,
  },
  webSite: {
    label: 'Organization Link',
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    max: 1000,
    optional: true,
    uniforms: {
      placeholder: 'e.g. http://www.example.com',
    },
  },
  logo: {
    label: 'URL to Organization Logo',
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    max: 1000,
    optional: true,
    uniforms: {
      placeholder: 'e.g. http://www.example.com/logo.png',
    },
  },
  tocForOrganizationsAccepted: {
    type: Boolean,
    allowedValues: [true],
    defaultValue: false,
  },
});

registerSchemaForI18n(OrganizationSchema);
