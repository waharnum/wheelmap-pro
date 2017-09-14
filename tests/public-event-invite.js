import expect from './helpers/matchers'

import {prepareCleanTest} from "./helpers/server";
import {UserHelper} from "./helpers/user";
import {OrganizationHelper} from "./helpers/organization";
import {EventHelper} from "./helpers/event";

// access public link
// event sign up user (invited-1)
// check acceptance
// sign out

// sign in user (invited-1)
// access public link
// check re-acceptance
// sign out

// sign up user (invited-2)
// access public link
// check acceptance
// sign out

// sign up user (invited-3)
// sign out
// access public link
// event sign in user (invited-3)
// check acceptance

let User;
let Organization;
let Event;

describe('PublicUserInvites @watch', function () {
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
    const event = Event.create("My Event");
    // publish event
    event.publish();
    // get public invite link
    event.getPublicInviteLink();
    // sign out
    User.signOut();
  });

  describe('SignUpWithPublicLink', function () {
    it('access sign-up', function () {

    });
  });
});
