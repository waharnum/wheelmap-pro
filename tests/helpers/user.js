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
      //  go to sign in page
      browserHelper.replaceHistory('/signin');
      browser.waitForExist('form.accounts');

      // fill form
      browser.waitForEnabled('#email');
      browser.addValue('form input#email', email);
      browser.waitForEnabled('#password[type="password"]');
      browser.addValue('#password[type="password"]', password);

      // submit
      browser.click('button[type="submit"]');
    },
    signOut: () => {
      //  go to sign up page
      browserHelper.replaceHistory('/profile');
      // browser.waitForExist('#ProfilePage');
      browser.click('button[type="submit"]');
      browser.waitForExist('#HomePage');
    },
    signUpAsGuestForEvent: (publicInviteLink, username) => {
      browser.url(publicInviteLink);
      browser.waitForExist('#PublicSignUpForEventPage');
      browser.addValue('form input[name="username"]', username);
      browser.click('input[name="toc"]');
      browser.click('input[type="submit"]');
      browser.waitForExist(".user-menu");
      expect(browser.$('.user-menu a').getText().toLowerCase()).toBe(username.toLowerCase());
    }
  };
}
