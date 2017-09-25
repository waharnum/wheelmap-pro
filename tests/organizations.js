import expect from './helpers/matchers'

import {prepareCleanTest} from "./helpers/server";
import {BrowserHelper} from "./helpers/browser";
import {UserHelper} from "./helpers/user";
import {OrganizationHelper} from "./helpers/organization";

let User;
let Organization;
let browserHelper;

describe('Organizations', function () {
  let publicInviteLink;
  let event;

  before(function () {
    // initialize helpers
    User = UserHelper(browser, server);
    Organization = new OrganizationHelper(browser, server);
    browserHelper = BrowserHelper(browser);

    prepareCleanTest(browser, server);

    // sign up moderator
    User.signUp("moderator@organization.com", "passwordHere");
  });

  it('create organization', function () {
    Organization.create("My Organization");
  });

  it('create organization with valid organization url', function () {
    Organization.submitCreateForm({name: "Organization With WebSite", webSite: "http://example.org", toc: true});
    browser.waitForExist('#OrganizeOrganizationPage');
  });

  it('create organization with valid logo url', function () {
    Organization.submitCreateForm({
      name: "Organization With Logo",
      logo: "https://static.pexels.com/photos/54632/cat-animal-eyes-grey-54632.jpeg",
      toc: true
    });
    browser.waitForExist('#OrganizeOrganizationPage');
  });

  it('create organization with invalid organization url', function () {
    Organization.submitCreateForm({name: "Invalid Organization", webSite: "this is no url", toc: true});
    browser.waitForExist("form.error");
    browser.waitForExist('.field.form-group.has-error input[name="webSite"]');
    browserHelper.replaceHistory(`/`);
  });

  it('create organization with invalid logo url', function () {
    Organization.submitCreateForm({name: "Organization With Invalid Logo", logo: "this is no url", toc: true});
    browser.waitForExist("form.error");
    browser.waitForExist('.field.form-group.has-error input[name="logo"]');
    browserHelper.replaceHistory(`/`);
  });

  it('organization dropdown contains created organizations', function () {
    const orgs = Organization.getOrganizations();
    expect(orgs.length).toBe(3);
    const names = orgs.map((o) => o.name);
    expect(names).toContain("My Organization");
    expect(names).toContain("Organization With WebSite");
    expect(names).toContain("Organization With Logo");
  });
});
