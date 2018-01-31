import {t} from 'c-3po';
import SimpleSchema from 'simpl-schema';

export const LicenseSchema = new SimpleSchema({
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
    label: t`Official english title`,
    max: 1000,
  },
  shortName: {
    type: String,
    label: t`Short name (optional)`,
    optional: true,
    max: 1000,
  },
  websiteURL: {
    type: String,
    label: t`Link to descriptive website (optional)`,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    max: 1000,
  },
  fullTextURL: {
    type: String,
    label: t`Link to full legal text (optional)`,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    max: 1000,
  },
  plainTextSummary: {
    type: String,
    label: t`Plaintext summary (optional)`,
    max: 100000,
    optional: true,
  },
  consideredAs: {
    type: String,
    label: t`Considered as...`,
    max: 100,
    allowedValues: [
      {label: t`Public Domain (CC0)`, value: 'CC0'},
      {label: t`Free, with Attribution required (CCBY)`, value: 'CCBY'},
      {label: t`Share Alike (CCSA)`, value: 'CCSA'},
      {label: t`Restricted / Proprietary (©)`, value: 'restricted'},
    ],
  },
});
