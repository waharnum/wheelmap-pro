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
      placeholder: t`e.g. Organization Name`,
    },
  },
  description: {
    label: t`Description (optional)`,
    type: String,
    max: 1000,
    optional: true,
    uniforms: {
      placeholder: t`e.g. Our organization is…`,
    },
  },
  address: {
    label: t`Address`,
    type: String,
    max: 1000,
    optional: true,
  },
  addressAdditional: {
    label: t`Address (Additional)`,
    type: String,
    max: 1000,
    optional: true,
  },
  zipCode: {
    label: t`ZIP-Code`,
    type: String,
    max: 1000,
    optional: true,
  },
  city: {
    label: t`City`,
    type: String,
    optional: true,
    max: 100,
  },
  country: {
    label: t`Country`,
    type: String,
    optional: true,
    max: 100,
  },
  phoneNumber: {
    label: t`Phone number`,
    type: String,
    max: 100,
    optional: true,
  },
  webSite: {
    label: t`Organization Link`,
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    max: 1000,
    optional: true,
    uniforms: {
      placeholder: t`e.g. http://www.example.com`,
    },
  },
  logo: {
    label: t`URL to Organization Logo`,
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    max: 1000,
    optional: true,
    uniforms: {
      placeholder: t`e.g. http://www.example.com/logo.png`,
    },
  },
  tocForOrganizationsAccepted: {
    label: t`Accept Terms & Conditions`,
    type: Boolean,
    allowedValues: [true],
    defaultValue: false,
  },
});

registerSchemaForI18n(OrganizationSchema);
