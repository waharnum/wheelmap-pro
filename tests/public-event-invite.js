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
    const event = Event.create("My Event");
    // publish event
    event.publish();
    // get public invite link
    publicInviteLink = event.getPublicInviteLink();
    // sign out
    User.signOut();
  });

  describe('SignUpWithPublicLink', function () {
    before(function () {
      browser.deleteCookie();
      browser.url(publicInviteLink);
      browser.waitForExist('#PublicSignUpForEventPage');
    });

    it('accept-sign-up as new user');

    it('accept-sign-in as existing user');

    it('visit link when already signed-in');

    it('visit accepted link again');

    it('accept-sign-in as guest user', function () {
      browser.click("button=LOGIN!");
    });
  });


});
