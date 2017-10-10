import {Organizations, IOrganization} from '../organizations/organizations';
import {getDisplayedNameForUser} from '../../lib/user-name';
import {getIconHTMLForUser, getGravatarImageUrl} from '../../lib/user-icon';
import {userHasFullAccessToReferencedOrganization} from '../organizations/privileges';

export interface IOrganizationMemberMixin {
  getOrganization: () => IOrganization;
  getUser: () => Meteor.User;
  getUserName: () => string;
  getIconHTML: () => string;
  editableBy: (userId: Mongo.ObjectID) => boolean;
}

export const OrganizationMemberMixin = {
  getOrganization() {
    return Organizations.findOne(this.organizationId);
  },
  getUser() {
    return Meteor.users.findOne(this.userId);
  },
  getUserName() {
    const user = this.getUser();
    return user && getDisplayedNameForUser(this.getUser()) || this.invitationEmailAddress;
  },
  getIconHTML() {
    if (this.userId) {
      return getIconHTMLForUser(this.getUser());
    }
    return `<img src="${getGravatarImageUrl(this.gravatarHash)}" class='user-icon'>`;
  },
  editableBy(userId: Mongo.ObjectID | null | undefined) {
    return userHasFullAccessToReferencedOrganization(userId as any as string, this);
  },
} as IOrganizationMemberMixin;
