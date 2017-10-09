import SimpleSchema from 'simpl-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {readdirSync} from 'fs';
import {uniq, flatten, intersection, fromPairs, mapKeys, Dictionary} from 'lodash';
import * as moment from 'moment';

// load all moment locales
import 'moment/min/locales';

const files = readdirSync('./assets/app/i18n');
const fallbackLanguage = 'en-DEV';

const availableLanguages = fromPairs(files.map((file) => {
  const name = file.substring(0, file.length - 8);
  return [name, JSON.parse(Assets.getText(`i18n/${name}.po.json`))]
}));

// Returns the locale as language code without country code etc. removed
// (for example "en" if given "en-GB").
function localeWithoutCountry(locale: string): string {
  return locale.substring(0, 2);
}

export const remove = new ValidatedMethod({
  name: 'i18n.getBestMatch',
  validate: new SimpleSchema({
    languages: {
      type: Array,
    },
    'languages.$': {
      type: String,
      max: 6,
      min: 2,
      regEx: /[A-z_]+/,
    },
  }).validator(),
  run({languages}: { languages: string[] }) {
    // Try all locales without a country code, too
    const languagesWithFallback = uniq(flatten(languages.map(l => [l, localeWithoutCountry(l)])));
    const potentialLanguages = intersection(languagesWithFallback, Object.keys(availableLanguages));
    const language = potentialLanguages[0] || fallbackLanguage;

    // remove all the leading underscores
    const momentData = mapKeys(moment.localeData(language) as Dictionary<any>, function (value, key) {
      return key.substr(1);
    });


    // we could potentially combine languages on the fly here, but this would be very confusing for plurals etc.
    return {language, data: availableLanguages[language], momentData};
  },
});
