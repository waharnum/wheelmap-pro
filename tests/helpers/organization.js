import expect from './matchers'
import {BaseMeteorUrl} from './server'
import {BrowserHelper} from "./browser";

export const OrganizationHelper = function (browser, server) {
  const browserHelper = BrowserHelper(browser);
  const organizationIdRegEx = /organizations\/([\w]+)\/organize/;

  return {
    create: (name) => {
      // get redirected to right organization page
      browserHelper.replaceHistory('/organizations/create');
      browser.waitForExist('#CreateOrganizationPage');

      // fill form
      browser.addValue('form input[name="name"]', name);
      browser.click('form input[name="tocForOrganizationsAccepted"]');
      browser.click('input.btn-primary[type="submit"]');

      browser.waitForExist('#OrganizeOrganizationPage');

      const match = browser.getUrl().match(organizationIdRegEx);
      if (!match) {
        throw new Error("could not determine organization id");
      }
      return match[1];
    },
  }
}
