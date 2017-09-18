import expect from './helpers/matchers'

import {BaseMeteorUrl, prepareCleanTest} from "./helpers/server";
import {BrowserHelper} from "./helpers/browser";
import {UserHelper} from "./helpers/user";
import {OrganizationHelper} from "./helpers/organization";
import {EventHelper} from "./helpers/event";

let User;
let Organization;
let Event;

describe('Public Invitation Flow @watch', function () {
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

  describe('Sign Up With Public Link', function () {
    it('accept-sign-up as new user');

    it('accept-sign-in as existing user');

    it('visit link when already signed-in');

    it('visit accepted link again');

    describe('First Guest', function () {
      it('signs up', function () {
        User.signUpAsGuestForEvent(publicInviteLink, "Heiner Wugold II");
        User.signOut();
      });
    });

    describe('Second Guest', function () {
      it('signs up', function () {
        User.signUpAsGuestForEvent(publicInviteLink, "Antoninia Burckhardth");
        User.signOut();
      });
    });

    describe('Failed Guest', function () {
      it('cannot sign up without name', function () {
        browser.url(publicInviteLink);
        browser.waitForExist('#PublicSignUpForEventPage');

        browser.click('input[type="submit"]');

        browser.waitForExist("form.error");
        browser.waitForExist('.field.form-group.has-error input[name="username"]');
      });

      it('cannot sign up without accepting toc', function () {
        browser.url(publicInviteLink);
        browser.waitForExist('#PublicSignUpForEventPage');
        browser.setValue('input[name="username"]', "I gave a name");
        browser.click('input[type="submit"]');

        browser.waitForExist("form.error");
        browser.waitForExist('.field.form-group.has-error input[name="toc"]');
      });
    });

    describe('Moderator', function () {
      it('has two guest participants', function () {
        // need to reset url, otherwise redirect will bring us to the publicInviteLink
        browser.url(BaseMeteorUrl);
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
