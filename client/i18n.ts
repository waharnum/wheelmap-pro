import {useLocale, addLocale} from 'c-3po';
import * as moment from 'moment';
import {T9n} from 'meteor/softwarerero:accounts-t9n';
import {currentLocale as mapLocale} from 'wheelmap-react/lib/lib/i18n';

// Returns an expanded list of preferred locales.
export function readUserLanguages() {
  // Note that some browsers don't support navigator.languages
  return window.navigator.languages || [];
}

export function preparei18n(callback: Function) {
  const languages = readUserLanguages();

  Meteor.call('i18n.getBestMatch', {languages}, (error, result) => {
    if (!error) {
      addLocale(result.language, result.data);
      useLocale(result.language);
      moment.updateLocale(result.momentData.abbr, result.momentData);

      (mapLocale as any) = result.language || 'en';

      const momentLocale = result.language || 'en-us';
      moment.locale(momentLocale);

      T9n.setLanguage(result.language || 'en');
      callback(result.language);
    } else {
      console.error('Failed loading i18n!', error);
      moment.locale('en-us');
      T9n.setLanguage('en');
      (mapLocale as any) = 'en';
      callback('en');
    }
  });
}


