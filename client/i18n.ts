import {T9n} from 'meteor/softwarerero:accounts-t9n';
import * as moment from 'moment';
import {uniq, flatten} from 'lodash';
import {useLocale, addLocale} from 'c-3po';
import {localeWithoutCountry} from '../imports/both/i18n/i18n';
import {currentLocale as mapLocale} from 'wheelmap-react/lib/lib/i18n';


// Returns an expanded list of preferred locales.
function getBrowserLanguages() {
  // Note that some browsers don't support navigator.languages
  return window.navigator.languages || [];
}

export const i18nSettings = {
  bestMatchClientLocale: 'en',
};

export const getUserLanguages = () => {
  return uniq(
    // ensure that the best match locale is the first in the list
    [i18nSettings.bestMatchClientLocale].concat(
      flatten(
        getBrowserLanguages().map(l => [l, localeWithoutCountry(l)]),
      ),
    ),
  );
};

export function preparei18n(callback: Function) {
  const languages = getBrowserLanguages();

  Meteor.call('i18n.getBestMatch', {languages}, (error, result) => {
    if (!error) {
      addLocale(result.language, result.data);
      useLocale(result.language);
      moment.updateLocale(result.momentData.abbr, result.momentData);

      (mapLocale as any) = result.language || 'en';

      const momentLocale = result.language || 'en-us';
      moment.locale(momentLocale);

      T9n.setLanguage(result.language || 'en');

      i18nSettings.bestMatchClientLocale = result.language || 'en';

      callback(result.language);
    } else {
      console.error('Failed loading i18n!', error);
      moment.locale('en-us');
      T9n.setLanguage('en');
      (mapLocale as any) = 'en';
      i18nSettings.bestMatchClientLocale = 'en';

      callback('en');
    }
  });
}


