import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

import {OrganizationSchema} from './schema';
import {OrganizationMembers} from '../organization-members/organization-members';
import {IOrganizationMixin, OrganizationMixin} from './mixins';

export interface IOrganization extends IOrganizationMixin {
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

export const Organizations = new Mongo.Collection<IOrganization & IOrganizationMixin>('Organizations');
Organizations.schema = OrganizationSchema;
Organizations.helpers(OrganizationMixin);
Organizations.attachSchema(Organizations.schema);

export function getOrganizationsMemberships(userId: Mongo.ObjectID) {
  const options = {fields: {organizationId: 1}};
  return OrganizationMembers.find({userId}, options).fetch().map((m) => m.organizationId);
};

export function getOrganizationsWhereCurrentUserIsMember() {
  const userId = Meteor.userId();
  const orgIds = getOrganizationsMemberships(userId as any as Mongo.ObjectID);
  return Organizations.find({_id: {$in: orgIds}});
};

export function setActiveOrganization(userId: Mongo.ObjectID,
                                      activeOrganizationId: Mongo.ObjectID,
                                      callback?: (error?, result?) => void): number {
  return Meteor.users.update(userId, {$set: {'profile.activeOrganizationId': activeOrganizationId}}, {}, callback);
};

export function getActiveOrganizationId(userId: Mongo.ObjectID): Mongo.ObjectID | null {
  const user = Meteor.users.findOne(userId);
  return user ? user.profile.activeOrganizationId : null;
};

export function getActiveOrganization(userId: Mongo.ObjectID): IOrganization | null {
  const activeOrganizationId = getActiveOrganizationId(userId);
  return activeOrganizationId ? Organizations.findOne(activeOrganizationId) : null;
};
