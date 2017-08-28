import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Sources } from '../../../../imports/both/api/sources/sources';
import { OrganizationMembers } from '../../../../imports/both/api/organization-members/organization-members';
import { Apps } from '../../../../imports/both/api/apps/apps';
import { countriesOfTheWorld } from '../../../../imports/both/lib/all-countries';
import { isAdmin } from '../../../../imports/both/lib/is-admin';
import {
  userHasFullAccessToOrganizationId,
  isUserMemberOfOrganizationWithId,
} from '../../../../imports/both/api/organizations/privileges';
import sortBy from 'lodash/sortBy';

const ACCESS_REQUEST_APPROVING_ROLES = [
  'developer',
  'manager',
  'founder',
  'member',
];

export const Organizations = new Mongo.Collection('Organizations');

Organizations.schema = new SimpleSchema({
  name: {
    label: 'Name of company or individual',
    type: String,
    max: 1000,
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
    label: 'Web-Site',
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    max: 1000,
    optional: true,
  },
  description: {
    label: 'Short description (optional)',
    type: String,
    max: 2000,
    optional: true,
    uniforms: {
      placeholder: 'Shashashsa',
    },
  },
  tocForOrganizationsAccepted: {
    type: Boolean,
    allowedValues: [true],
    defaultValue: false,
  },
});

Organizations.helpers({
  editableBy(userId) {
    if (!userId) return false;
    check(userId, String);
    return userHasFullAccessToOrganizationId(userId, this._id);
  },
  isFullyVisibleForUserId(userId) {
    if (!userId) return false;
    return isAdmin(userId) || isUserMemberOfOrganizationWithId(userId, this._id);
  },
  getSources() {
    const sources = Sources.find({ organizationId: this._id }).fetch();
    return sortBy(sortBy(sources, (s) => -s.placeInfoCount), 'isDraft');
  },
  getApps() {
    return Apps.find({ organizationId: this._id });
  },
  getMostAuthoritativeUserThatCanApproveAccessRequests() {
    for (const role of ACCESS_REQUEST_APPROVING_ROLES) {
      const result = OrganizationMembers.findOne({
        organizationId: this._id,
        role,
      });

      if (result) {
        return Meteor.users.findOne(result.userId);
      }
    }

    return null;
  },
});

Organizations.whereCurrentUserIsMember = () => {
  const userId = Meteor.userId();
  const options = { transform: null, fields: { organizationId: 1 } };
  const orgIds = OrganizationMembers.find({ userId }, options).fetch().map((m) => m.organizationId);
  return Organizations.find({ _id: { $in: orgIds } });
};

Organizations.attachSchema(Organizations.schema);
