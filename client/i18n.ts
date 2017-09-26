import {uniq, flatten, intersection} from 'lodash';
import {useLocale, addLocale} from 'c-3po';
import * as moment from 'moment';
import {T9n} from 'meteor/softwarerero:accounts-t9n';

const fallbackLanguage = 'en-DEV';
const availableLanguages = ['de-DE', 'en-DEV'];

// Returns the locale as language code without country code etc. removed
// (for example "en" if given "en-GB").
function localeWithoutCountry(locale: string): string {
  return locale.substring(0, 2);
}

// Returns an expanded list of preferred locales.
export function readUserLanguages() {
  // Note that some browsers don't support navigator.languages
  const languagesPreferredByUser = window.navigator.languages || [];
  const languages = languagesPreferredByUser.concat([window.navigator.language, fallbackLanguage]);

  // Try all locales without a country code, too
  return uniq(flatten(languages.map(l => [l, localeWithoutCountry(l)])));
}

const userLanguages = readUserLanguages();
const validLanguages = intersection(userLanguages, availableLanguages);

validLanguages.forEach((language) => {
  fetch(Meteor.absoluteUrl(`/i18n/${language}.po.json`))
    .then((response) => response.json())
    .then((translationObject) => {
      addLocale(language, translationObject);
    });
  // TODO: disable locales that failed loading & choose correct locale again
});

const c3poLocale = validLanguages[0] || fallbackLanguage
useLocale(c3poLocale);

const momentLocale = userLanguages.length > 0 ? userLanguages[0].toLowerCase() : 'en-us';
moment.locale(momentLocale);

T9n.setLanguage(userLanguages[0] || 'en');
