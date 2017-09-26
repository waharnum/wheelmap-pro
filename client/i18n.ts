import {uniq, flatten, intersection} from 'lodash';
import {useLocale, addLocale} from 'c-3po';
import * as moment from 'moment';

const defaultLocale = 'en-DEV';
const existingLocales = ['de-DE', 'en-DEV'];

// Returns the locale as language code without country code etc. removed
// (for example "en" if given "en-GB").
function localeWithoutCountry(locale: string): string {
  return locale.substring(0, 2);
}

// Returns an expanded list of preferred locales.
export function expandedPreferredLocales() {
  // Note that some browsers don't support navigator.languages
  const localesPreferredByUser = window.navigator.languages || [];
  const locales = localesPreferredByUser.concat([window.navigator.language, defaultLocale]);

  // Try all locales without country code, too
  return uniq(flatten(locales.map(l => [l, localeWithoutCountry(l)])));
}

const locales = intersection(expandedPreferredLocales(), existingLocales);

locales.forEach((locale) => {
  fetch(Meteor.absoluteUrl(`/i18n/${locale}.po.json`))
    .then((response) => response.json())
    .then((translationObject) => {
      addLocale(locale, translationObject);
    });
  // TODO: disable locales that failed loading & choose correct locale again
});

const c3poLocale = locales[0] || defaultLocale
useLocale(c3poLocale);

const momentLocale = locales.length > 0 ? locales[0].toLowerCase() : 'en-us';
moment.locale(momentLocale);
