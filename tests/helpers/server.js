const getMeteorUrl = () => {
  return Meteor.absoluteUrl()
};

const doResetDatabase = () => {
  Package['xolvio:cleaner'].resetDatabase();
}

export let BaseMeteorUrl = '';

export const prepareCleanTest = (browser, server) => {
  BaseMeteorUrl = server.execute(getMeteorUrl);
  // remove all data
  server.execute(doResetDatabase);
  // delete all cookies
  browser.deleteCookie();
  // set custom email stub
  server.call('emailStub/stub');
  // go to root
  browser.url(BaseMeteorUrl);
};

