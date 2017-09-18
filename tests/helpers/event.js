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
        organize: () => {
          browserHelper.replaceHistory(`/events/${id}/organize`);
          browser.waitForExist('#OrganizeEventPage');
        },
        publish: () => {
          browserHelper.replaceHistory(`/events/${id}/organize`);
          browser.waitForExist('#OrganizeEventPage');
          browser.click('button=Publish event');
        },
        getPublicInviteLink: () => {
          browserHelper.replaceHistory(`/events/${id}/participants`);
          browser.waitForExist('#EventParticipantsPage');
        },
        invite: (email) => {
          browserHelper.replaceHistory(`/events/${id}/participants`);
          browser.waitForExist('#EventParticipantsPage');

          browser.addValue('form input[name="invitationEmailAddresses.0"]', email);
          browser.click('input.btn-primary[type="submit"]');
        },
        uninvite: (email) => {
          browserHelper.replaceHistory(`/events/${id}/participants`);
          browser.waitForExist('#EventParticipantsPage');

          browser.$(`.participant-name=${email}`).$('..').click('.participant-remove');
        },
        getInvitees: () => {
          browserHelper.replaceHistory(`/events/${id}/participants`);
          return browser.elements(".participant-entry").value.map(e => {
            const name = e.$(".participant-name").getText();
            const state = e.$(".participant-state").getText();
            return {name, state};
          })
        },
      }
    },
  }
}
