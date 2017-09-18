import expect from './matchers'
import {BrowserHelper} from "./browser";

class Event {
  constructor(id, browser) {
    this.id = id;
    this.browserHelper = BrowserHelper(browser);
    this.browser = browser;
  }

  organize = () => {
    this.browserHelper.replaceHistory(`/events/${this.id}/organize`);
    this.browser.waitForExist('#OrganizeEventPage');
  }
  publish = () => {
    this.browserHelper.replaceHistory(`/events/${this.id}/organize`);
    this.browser.waitForExist('#OrganizeEventPage');
    this.browser.click('button=Publish event');
  }
  getPublicInviteLink = () => {
    this.browserHelper.replaceHistory(`/events/${this.id}/participants`);
    this.browser.waitForExist('#EventParticipantsPage');

    return this.browser.$('input#public-link[type="text"]').getValue();
  }
  invite = (email) => {
    this.browserHelper.replaceHistory(`/events/${this.id}/participants`);
    this.browser.waitForExist('#EventParticipantsPage');

    this.browser.addValue('form input[name="invitationEmailAddresses.0"]', email);
    this.browser.click('input.btn-primary[type="submit"]');
  }
  uninvite = (email) => {
    this.browserHelper.replaceHistory(`/events/${this.id}/participants`);
    this.browser.waitForExist('#EventParticipantsPage');

    this.browser.$(`.participant-name=${email}`).$('..').click('.participant-remove');
  }
  getInvitees = () => {
    this.browserHelper.replaceHistory(`/events/${this.id}/participants`);
    this.browser.waitForExist('#EventParticipantsPage');

    return this.browser.elements(".participant-entry").value.map(e => {
      const name = e.$(".participant-name").getText();
      const state = e.$(".participant-state").getText();
      return {name, state};
    })
  }
}

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
      return new Event(id, browser);
    },
  }
}
