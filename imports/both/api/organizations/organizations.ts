import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { OrganizationSchema } from './schema';
import { Helpers } from './methods';
import { OrganizationMembers } from '../organization-members/organization-members';

export interface IOrganization {
  // mongo id
  _id?: Mongo.ObjectID;
  // fields
  name: string;
  description?: string;
  address?: string;
  addressAdditional?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  webSite?: string;
  logo?: string;
  tocForOrganizationsAccepted: boolean;
  // Helpers
  editableBy: (userId: Mongo.ObjectID) => boolean;
  isFullyVisibleForUserId: (userId: Mongo.ObjectID) => boolean;
  getSources: () => any[];
  getApps: () => any[];
  getMostAuthoritativeUserThatCanApproveAccessRequests: () => any[];
};

export const Organizations = new Mongo.Collection<IOrganization>('Organizations');
Organizations.schema = OrganizationSchema;

export const OrganizationWhereCurrentUserIsMember = () => {
  const userId = Meteor.userId();
  const options = { transform: null, fields: { organizationId: 1 } };
  const orgIds = OrganizationMembers.find({ userId }, options).fetch().map((m) => m.organizationId);
  return Organizations.find({ _id: { $in: orgIds } });
};

Organizations.helpers(Helpers);
Organizations.attachSchema(Organizations.schema);
