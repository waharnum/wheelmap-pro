import expect from './matchers'
import {BrowserHelper} from "./browser";

export const EventHelper = function (browser, server) {
  const browserHelper = BrowserHelper(browser);
  const eventIdRegEx = /events\/([\w]+)\/organize/;

  return {
    create: (name) => {
      // get redirected to right organization page
      browserHelper.replaceHistory('/events/create');
      browser.waitForExist('#CreateEventPage');

      // fill form
      browser.addValue('form input[name="name"]', name);
      browser.click('input.btn-primary[type="submit"]');

      browser.waitForExist('#OrganizeEventPage');

      const match = browser.getUrl().match(eventIdRegEx);
      if (!match) {
        throw new Error("could not determine event id");
      }

      const id = match[1];
      return {
        publish: () => {
        },
        getPublicInviteLink: () => {
          browserHelper.replaceHistory(`/events/${id}/participants`);
        }
      }
    },
  }
}
