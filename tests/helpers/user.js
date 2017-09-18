import expect from './matchers'
import {BrowserHelper} from "./browser";


export const UserHelper = function (browser, server) {
  const browserHelper = BrowserHelper(browser);

  return {
    signUp: (email, password) => {
      //  go to sign up page
      browserHelper.replaceHistory('/signup');
      browser.waitForExist('form.accounts');

      // fill form
      browser.waitForEnabled('#email');
      browser.addValue('form input#email', email);
      browser.waitForEnabled('#password[type="password"]');
      browser.addValue('#password[type="password"]', password);

      // submit
      browser.click('button[type="submit"]');

      browser.waitForExist('#NoOrganizationsPage');
      expect(browser.getUrl()).toEndWith('/organizations/none');
    },
    signIn: (email, password) => {
    },
    signOut: () => {
      //  go to sign up page
      browserHelper.replaceHistory('/profile');
      browser.click('button[type="submit"]');
    }
  };
}