import {Mongo} from 'meteor/mongo';

import {RoleType} from './roles';
import {OrganizationMemberMixin, IOrganizationMemberMixin} from './mixins';
import {OrganizationMemberSchema} from './schema';
import {InvitationStateType} from './invitationStates';

export interface IOrganizationMember extends IOrganizationMemberMixin {
  // mongo id
  _id?: Mongo.ObjectID;
  // fields
  organizationId: Mongo.ObjectID;
  userId: string | null;
  gravatarHash?: string;
  invitationState?: InvitationStateType;
  invitationError?: string;
  invitationToken?: string;
  invitationEmailAddress?: string;
  role: RoleType;
};

export const OrganizationMembers =
  new Mongo.Collection<IOrganizationMember & IOrganizationMemberMixin>('OrganizationMembers');
OrganizationMembers.schema = OrganizationMemberSchema;
OrganizationMembers.attachSchema(OrganizationMembers.schema);
OrganizationMembers.helpers(OrganizationMemberMixin);
