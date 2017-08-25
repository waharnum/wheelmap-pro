import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { isAdmin } from '/both/lib/is-admin';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Organizations } from '/both/api/organizations/organizations';
import { userHasFullAccessToOrganizationId } from '/both/api/organizations/privileges';

export const Licenses = new Mongo.Collection('Licenses');

Licenses.schema = new SimpleSchema({
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
    label: 'Official english title',
    max: 1000,
  },
  shortName: {
    type: String,
    label: 'shortName (optional)',
    optional: true,
    max: 1000,
  },
  websiteURL: {
    type: String,
    label: 'Link to descriptive website (optional)',
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    max: 1000,
  },
  fullTextURL: {
    type: String,
    label: 'Link to full legal text (optional)',
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    max: 1000,
  },
  plainTextSummary: {
    type: String,
    label: 'Plaintext summary (optional)',
    max: 100000,
    optional: true,
  },
  consideredAs: {
    type: String,
    label: 'Considered as...',
    max: 100,
    allowedValues: [
      { label: 'Public Domain (CC0)', value: 'CC0' },
      { label: 'Free, with Attribution required (CCBY)', value: 'CCBY' },
      { label: 'Share Alike (CCSA)', value: 'CCSA' },
      { label: 'Restricted / Proprietary (©)', value: 'restricted' },
    ],
  },
});

Licenses.attachSchema(Licenses.schema);

Licenses.helpers({
  editableBy(userId) {
    if (!userId) return false;
    check(userId, String);
    return isAdmin(userId) || userHasFullAccessToOrganizationId(userId, this.organizationId);
  },
});

Licenses.helpers({
  getOrganization() {
    return Organizations.findOne(this.organizationId);
  },
});
