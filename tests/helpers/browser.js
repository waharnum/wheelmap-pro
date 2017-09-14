function doReplace(path) {
  try {
    browserHistory = require('react-router').browserHistory
    browserHistory.replace(path);
  } catch (e) {
  }
}

export function BrowserHelper(browser) {
  return {
    replaceHistory: (path) => {
      return browser.execute(doReplace, path);
    }
  };
}
