import expect from './helpers/matchers'
import {prepareCleanTest} from "./helpers/server";

describe('SignUp', function () {
  const emailAddress = 'test@example.com';
  const password = 'needsToBeAtLeastSevenLetters';

  before(function () {
    prepareCleanTest(browser, server);
  });
  it('access sign-up', function () {
    browser.waitForExist('#HomePage');

    const elements = browser.elements('.loginState a');

    assert.equal(elements.value[0].getText(), 'SIGN-UP');
    browser.elementIdClick(elements.value[0].ELEMENT);

    browser.waitForExist('form.accounts');
    expect(browser.getUrl()).toEndWith('/signup');
  });
  it('sign-up with user name and password', function () {

    browser.waitForEnabled('#email');
    browser.addValue('form input#email', emailAddress);

    browser.waitForEnabled('#password[type="password"]');
    browser.addValue('#password[type="password"]', password);

    browser.click('button[type="submit"]');

    browser.waitForExist('#NoOrganizationsPage');
    expect(browser.getUrl()).toEndWith('/organizations/none');

    const emails = server.call('emailStub/getEmails');

    expect(emails[0].subject).toMatch(/verify email address/);
    expect(emails[0].to).toEqual(emailAddress);
  });
  it('sign-out again', function () {
    browser.click('.secondary-tools .user-menu');

    browser.waitForExist('form.accounts');
    browser.click('button[type="submit"]');

    browser.waitForExist('#HomePage');
    expect(browser.getUrl()).toEndWith('/welcome');
  });
  it('access sign-in', function () {
    browser.waitForExist('#HomePage');

    const elements = browser.elements('.loginState a');

    assert.equal(elements.value[1].getText(), 'LOGIN');
    browser.elementIdClick(elements.value[1].ELEMENT);

    browser.waitForExist('form.accounts');
    expect(browser.getUrl()).toEndWith('/signin');
  });
  it('sign-in with user name and password', function () {

    browser.waitForEnabled('#email');
    browser.addValue('form input#email', emailAddress);

    browser.waitForEnabled('#password[type="password"]');
    browser.addValue('#password[type="password"]', password);

    browser.click('button[type="submit"]');

    browser.waitForExist('#NoOrganizationsPage');
    expect(browser.getUrl()).toEndWith('/organizations/none');
  });
});
