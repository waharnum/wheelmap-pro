import {Organizations, IOrganization} from '../organizations/organizations';
import {getDisplayedNameForUser} from '../../lib/user-name';
import {getIconHTMLForUser, getGravatarImageUrl} from '../../lib/user-icon';

export interface IOrganizationMemberMixin {
  getOrganization: () => IOrganization;
  getUser: () => Meteor.User;
  getUserName: () => string;
  getIconHTML: () => string;
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
} as IOrganizationMemberMixin;
