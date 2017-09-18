import expect from './helpers/matchers'

import {prepareCleanTest} from "./helpers/server";
import {BrowserHelper} from "./helpers/browser";
import {UserHelper} from "./helpers/user";
import {OrganizationHelper} from "./helpers/organization";
import {EventHelper} from "./helpers/event";

let User;
let Organization;
let Event;

describe('PublicUserInvites @watch', function () {
  let publicInviteLink;
  let event;

  before(function () {
    // initialize helpers
    User = UserHelper(browser, server);
    Organization = OrganizationHelper(browser, server);
    Event = EventHelper(browser, server);

    const browserHelper = BrowserHelper(browser);
    prepareCleanTest(browser, server);

    // sign up moderator
    User.signUp("moderator@organization.com", "passwordHere");
    // create organization
    Organization.create("My Organization");
    // create event
    event = Event.create("My Event");
    // publish event
    event.publish();
    // store public invite link for new accounts
    publicInviteLink = event.getPublicInviteLink();
    // sign out
    User.signOut();
  });

  describe('SignUpWithPublicLink', function () {
    it('accept-sign-up as new user');

    it('accept-sign-in as existing user');

    it('visit link when already signed-in');

    it('visit accepted link again');

    describe('First Guest', function () {
      it('accept-join-guest', function () {
        browser.url(publicInviteLink);
        browser.waitForExist('#PublicSignUpForEventPage');
        browser.deleteCookie();

        const username = "Heiner Wugold II";
        browser.addValue('form input[name="username"]', username);
        browser.click('input[type="submit"]');
        browser.waitForExist(".user-menu");
        expect(browser.$('.user-menu a').getText().toLowerCase()).toBe(username.toLowerCase());
        User.signOut();
      });
    });

    describe('Second Guest', function () {
      it('accept-join-guest', function () {
        browser.url(publicInviteLink);
        browser.waitForExist('#PublicSignUpForEventPage');
        browser.deleteCookie();

        const username = "Antoninia Burckhardth";
        browser.addValue('form input[name="username"]', username);
        browser.click('input[type="submit"]');
        browser.waitForExist(".user-menu");
        expect(browser.$('.user-menu a').getText().toLowerCase()).toBe(username.toLowerCase());
        User.signOut();
      });
    });

    describe('Check Participants', function () {
      it('read-participants-moderator', function () {
        User.signIn("moderator@organization.com", "passwordHere");
        browser.waitForExist('#OrganizeOrganizationPage');
        const invitees = event.getInvitees();
        expect(invitees.length).toBe(2);
        expect(invitees).toContain({name: "Heiner Wugold II", state: 'old-guest'});
        expect(invitees).toContain({name: "Antoninia Burckhardth", state: 'old-guest'});
      });
    });
  });


});
