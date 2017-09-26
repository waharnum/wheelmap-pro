import {Mongo} from 'meteor/mongo';

import {RoleType} from './roles';
import {OrganizationMemberMixin, IOrganizationMemberMixin} from './mixins';
import {OrganizationMemberSchema} from './schema';

export interface IOrganizationMember {
  // mongo id
  _id?: Mongo.ObjectID;
  // fields
  organizationId: Mongo.ObjectID;
  userId: Mongo.ObjectID | null;
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
OrganizationMembers.helpers(OrganizationMemberMixin);
