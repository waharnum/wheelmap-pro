import expect from './helpers/matchers'

import {prepareCleanTest} from "./helpers/server";
import {UserHelper} from "./helpers/user";
import {OrganizationHelper} from "./helpers/organization";
import {EventHelper} from "./helpers/event";

let User;
let Organization;
let Event;

describe('InviteToEventViaEmail @watch', function () {
  let event;
  before(function () {

    // initialize helpers
    User = UserHelper(browser, server);
    Organization = OrganizationHelper(browser, server);
    Event = EventHelper(browser, server);

    prepareCleanTest(browser, server);

    // sign up moderator
    User.signUp("moderator@organization.com", "passwordHere");
    // create organization
    Organization.create("My Organization");
    // create event
    event = Event.create("My Event");
  });

  describe('InviteViaEmail', function () {
    const users = ["test1@user.com", "test2@user.com", "test3@user.com"];

    it('InviteBeforePublication', function () {
      event.invite("test1@user.com");
      event.invite("test2@user.com");
      event.invite("test3@user.com");
      // invite same user twice
      event.invite("test2@user.com");

      const invitees = event.getInvitees();
      expect(invitees.length).toBe(3);
      expect(invitees).toContain({name: "test1@user.com", state: 'draft'});
      expect(invitees).toContain({name: "test2@user.com", state: 'draft'});
      expect(invitees).toContain({name: "test3@user.com", state: 'draft'});
    });

    it('RemoveInviteBeforePublication', function () {
      event.uninvite("test2@user.com");

      const invitees = event.getInvitees();
      expect(invitees.length).toBe(2);
      expect(invitees).not.toContain({name: "test2@user.com", state: 'draft'});
    });

    it('NoEmailsWereSent', function () {
      // this is a hack to wait for the emails to be collected :/
      event.organize();

      const allEmails = server.call('emailStub/getEmails');
      const inviteEmails = allEmails.filter((e) => users.includes(e.to));
      expect(inviteEmails.length).toBe(0);
    });

    it('Publish', function () {
      event.publish();
    });

    it('InitialEmailsWereSent', function () {
      // this is a hack to wait for the emails to be collected :/
      event.organize();

      const allEmails = server.call('emailStub/getEmails');
      const inviteEmails = allEmails.filter((e) => users.includes(e.to));
      expect(inviteEmails.length).toBe(2);
    });

    it('InviteAfterPublication', function () {
      event.invite("test2@user.com");
      const invitees = event.getInvitees();
      expect(invitees.length).toBe(3);
      expect(invitees).toContain({name: "test1@user.com", state: 'sent'});
      expect(invitees).toContain({name: "test2@user.com", state: 'sent'});
      expect(invitees).toContain({name: "test3@user.com", state: 'sent'});
    });

    it('MoreEmailsWereSent', function () {
      // this is a hack to wait for the emails to be collected :/
      event.organize();

      const allEmails = server.call('emailStub/getEmails');
      const inviteEmails = allEmails.filter((e) => users.includes(e.to));
      expect(inviteEmails.length).toBe(3);
    });

    it('RemoveInviteAfterPublication', function () {
      event.uninvite("test2@user.com");
      const invitees = event.getInvitees();
      expect(invitees.length).toBe(2);
      expect(invitees).not.toContain({name: "test2@user.com", state: 'sent'});
    });
  });
});
