import {Events, IEvent} from '../events/events';
import {Organizations, IOrganization} from '../organizations/organizations';
import {getDisplayedNameForUser} from '../../lib/user-name';
import {getIconHTMLForUser, getGravatarImageUrl} from '../../lib/user-icon';

export interface IEventParticipantMixin {
  getOrganization: () => IOrganization | null;
  getOrganizationId: () => Mongo.ObjectID | null;
  getEvent: () => IEvent;
  getUser: () => Meteor.User;
  getUserName: () => string;
  getIconHTML: () => string;
}

export const EventParticipantMixin = {
  getOrganization() {
    const event = this.getEvent();
    return event ? event.getOrganization() : null;
  },
  getOrganizationId() {
    const event = Events.findOne(this.eventId, {fields: {organizationId: 1}});
    return event ? event.organizationId : null;
  },
  getEvent() {
    return Events.findOne(this.eventId);
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
} as IEventParticipantMixin;
