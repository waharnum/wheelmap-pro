import find from 'lodash/find';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { isAdmin } from '/both/lib/is-admin';

import { Licenses } from '/both/api/licenses/licenses';
import { Organizations } from '/both/api/organizations/organizations';
import { SourceImports } from '/both/api/source-imports/source-imports';
import { isUserMemberOfOrganizationWithId } from '/both/api/organizations/privileges.js';

export const Sources = new Mongo.Collection('Sources');

Sources.schema = new SimpleSchema({
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    label: 'Name',
    type: String,
  },
  shortName: {
    label: 'Short name for backlinks (should include your Organization)',
    type: String,
    max: 12,
  },
  licenseId: {
    label: 'License',
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  description: {
    label: 'Description',
    type: String,
    optional: true,
  },
  originWebsiteURL: {
    label: 'Web-site (optional)',
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
  'translations.additionalAccessibilityInformation.en_US': {
    label: 'Additional accessibility information (English)',
    type: String,
    optional: true,
  },
  isDraft: {
    type: Boolean,
    label: 'Only a draft (content not available to people outside your organization)',
    defaultValue: true,
    optional: true,
  },
  streamChain: {
    type: Array,
    label: 'Stream chain setup',
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
    label: 'Data is available to everybody',
    defaultValue: true,
  },
  isRequestable: {
    type: Boolean,
    label: 'Access to this data source can be requested',
    defaultValue: false,
  },
  accessRestrictedTo: {
    type: Array,
    label: 'Data is available to everybody',
    defaultValue: [],
  },
  'accessRestrictedTo.$': {
    type: String,
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

Sources.attachSchema(Sources.schema);

Sources.relationships = {
  belongsTo: {
    license: {
      foreignCollection: Licenses,
      foreignKey: 'licenseId',
    },
  },
};

Sources.helpers({
  isFullyVisibleForUserId(userId) {
    return isAdmin(userId)
            || isUserMemberOfOrganizationWithId(userId, this.organizationId)
            || this.isFreelyAccessible;
  },
  isEditableBy(userId) {
    if (!userId) {
      return false;
    }
    return isAdmin(userId)
            || isUserMemberOfOrganizationWithId(userId, this.organizationId);
  },
  hasRestrictedAccessForUserId(userId) {
    const allowedOrganizationIDs = this.accessRestrictedTo || [];
    const userBelongsToAnAllowedOrganization = allowedOrganizationIDs.some(
      organizationId => isUserMemberOfOrganizationWithId(userId, organizationId)
    );

    return !this.isFreelyAccessible && userBelongsToAnAllowedOrganization;
  },
  isVisibleForUserId(userId) {
    return this.isFullyVisibleForUserId(userId) || this.hasRestrictedAccessForUserId(userId);
  },
  getOrganization() {
    return Organizations.findOne(this.organizationId);
  },
  getLicense() {
    return Licenses.findOne(this.licenseId);
  },
  inputMimeType() {
    const downloadItem = find(this.streamChain, chainItem => chainItem.type === 'HTTPDownload');
    return (downloadItem && downloadItem.parameters && downloadItem.parameters.inputMimeType);
  },
  inputMimeTypeName() {
    switch (this.inputMimeType()) {
      case 'application/json': return 'JSON';
      case 'text/csv': return 'CSV';
      default: return '(Unknown format)';
    }
  },
  hasDownloadStep() {
    // This should be using SimpleSchema validators on all mappings steps to validate the mappings.
    if (!this.streamChain) {
      return false;
    }
    const hasDownloadStep = !!this.streamChain.find((step) =>
      step.type === 'HTTPDownload' && !!step.parameters.sourceUrl);
    return hasDownloadStep;
  },
  getLastSuccessfulImport() {
    return SourceImports
      .find({ sourceId: this._id, isFinished: true }, { sort: { startTimestamp: -1 } })
      .fetch()
      .find(i => (!i.hasError() && !i.isAborted()));
  },
  getLastImportWithStats() {
    return SourceImports
      .find({ sourceId: this._id, isFinished: true }, { sort: { startTimestamp: -1 } })
      .fetch()
      .find(i => Boolean(i.attributeDistribution));
  },
});

