import SimpleSchema from 'simpl-schema';
import {t} from 'c-3po';

// allow custom uniforms fields
SimpleSchema.extendOptions(['uniforms']);

export const SourcesSchema = new SimpleSchema({
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    label: t`Name`,
    type: String,
  },
  shortName: {
    label: t`Short name for backlinks (should include your Organization)`,
    type: String,
    max: 12,
  },
  licenseId: {
    label: t`License`,
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  description: {
    label: t`Description`,
    type: String,
    optional: true,
  },
  originWebsiteURL: {
    label: t`Web-site (optional)`,
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
  'translations.additionalAccessibilityInformation.en_US': {
    label: t`Additional accessibility information (English)`,
    type: String,
    optional: true,
  },
  isDraft: {
    type: Boolean,
    label: t`Only a draft (content not available to people outside your organization)`,
    defaultValue: true,
    optional: true,
  },
  streamChain: {
    type: Array,
    label: t`Stream chain setup`,
    optional: true,
  },
  'streamChain.$': {
    type: Object,
    blackbox: true,
  },
  'streamChain.$.type': {
    type: String,
  },
  isFreelyAccessible: {
    type: Boolean,
    label: t`Data is available to everybody`,
    defaultValue: true,
  },
  isRequestable: {
    type: Boolean,
    label: t`Access to this data source can be requested`,
    defaultValue: false,
  },
  accessRestrictedTo: {
    type: Array,
    label: t`Data is available to everybody`,
    defaultValue: [],
  },
  'accessRestrictedTo.$': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  hasRunningImport: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  placeInfoCount: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  isShownOnStartPage: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
});
