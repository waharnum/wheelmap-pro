import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Organizations } from '/imports/both/api/organizations/organizations';

export const Apps = new Mongo.Collection('Apps');

Apps.schema = new SimpleSchema({
  tokenString: {
    type: String,
    optional: true,
  },
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
    label: 'Description (optional)',
    optional: true,
  },
  websiteURL: {
    label: 'Website (optional)',
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
  tocForAppsAccepted: {
    type: Boolean,
    allowedValues: [true],
  },
});

Apps.attachSchema(Apps.schema);

Apps.helpers({
  getOrganization() {
    return Organizations.findOne(this.organizationId);
  },
});
