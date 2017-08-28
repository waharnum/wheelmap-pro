import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

import sortBy from 'lodash/sortBy';

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

const ACCESS_REQUEST_APPROVING_ROLES = [
  'developer',
  'manager',
  'founder',
  'member',
];

export interface IOrganization {
  _id?: Mongo.ObjectID;
  name: string;
  description?: string;
  webSite?: string;
  logo?: string;
  tocForOrganizationsAccepted: boolean;
};

export const Organizations = new Mongo.Collection<IOrganization>('Organizations');

// allow custom uniforms fields
SimpleSchema.extendOptions(['uniforms']);

Organizations.schema = new SimpleSchema({
  name: {
    label: 'Name',
    type: String,
    max: 1000,
    uniforms: {
      placeholder: 'e.g. Organization Name',
    },
  },
  description: {
    label: 'Description (optional)',
    type: String,
    max: 2000,
    optional: true,
    uniforms: {
      placeholder: 'e.g. Our organization is…',
    },
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

// Organizations.whereCurrentUserIsMember = () => {
//   const userId = Meteor.userId();
//   const options = { transform: null, fields: { organizationId: 1 } };
//   const orgIds = OrganizationMembers.find({ userId }, options).fetch().map((m) => m.organizationId);
//   return Organizations.find({ _id: { $in: orgIds } });
// };

Organizations.attachSchema(Organizations.schema);