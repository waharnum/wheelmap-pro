import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import { RoleType } from './roles';
import { Organizations } from '../organizations/organizations';
import { Helpers, IHelpers } from './helpers';
import { OrganizationMemberSchema } from './schema';

export interface IOrganizationMember {
  // mongo id
  _id?: Mongo.ObjectID;
  // fields
  organizationId: Mongo.ObjectID;
  userId: Mongo.ObjectID;
  gravatarHash?: string;
  invitationState?: string; // 'queuedForSending' | 'sent' | 'accepted' | 'error';
  invitationError?: string;
  invitationToken?: string;
  invitationEmailAddress?: string;
  role: RoleType;
};

export const OrganizationMembers = new Mongo.Collection<IOrganizationMember>('OrganizationMembers');
OrganizationMembers.schema = OrganizationMemberSchema;
OrganizationMembers.attachSchema(OrganizationMembers.schema);
OrganizationMembers.helpers(Helpers);
