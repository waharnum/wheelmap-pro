import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { OrganizationSchema } from './schema';
import { IHelpers, Helpers } from './helpers';
import { OrganizationMembers } from '../organization-members/organization-members';

export interface IOrganization extends IHelpers {
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
};

export const Organizations = new Mongo.Collection<IOrganization & IHelpers>('Organizations');
Organizations.schema = OrganizationSchema;
Organizations.helpers(Helpers);
Organizations.attachSchema(Organizations.schema);

export const OrganizationWhereCurrentUserIsMember = () => {
  const userId = Meteor.userId();
  const options = { transform: null, fields: { organizationId: 1 } };
  const orgIds = OrganizationMembers.find({ userId }, options).fetch().map((m) => m.organizationId);
  return Organizations.find({ _id: { $in: orgIds } });
};
