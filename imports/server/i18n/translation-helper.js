import { s } from 'meteor/underscorestring:underscore.string';
import get from 'lodash/get';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';
import { resourceSlugForCollection } from './resource-slug';
import { getLocales } from './locales';

function findLocaleWithCountry(resourceSlug, localeWithoutCountry) {
  const regexp = new RegExp(`^${localeWithoutCountry}_`);
  const locales = getLocales(resourceSlug);
  const result = locales.find(locale => locale.match(regexp));
  return result;
}

export function createTranslationHelper(
  { resourceSlug, defaultLocale, getTranslationFn, msgidFn = (d) => d }
) {
  return (requestedLocale, docOrMsgId) => {
    const sanitizedRequestedLocale = requestedLocale.replace('_', '-');
    const localeWithoutCountry = requestedLocale.substring(0,2).toLowerCase();
    const localeHasCountry = sanitizedRequestedLocale !== localeWithoutCountry;
    const localeWithDefaultCountry = localeHasCountry ? sanitizedRequestedLocale :
      findLocaleWithCountry(resourceSlug, sanitizedRequestedLocale);

    const localesToTry = [
      requestedLocale,
      sanitizedRequestedLocale,
      localeWithoutCountry,
      localeWithDefaultCountry,
      defaultLocale,
    ];

    for (const locale of localesToTry) {
      const translation = getTranslationFn(locale, docOrMsgId);
      if (translation) {
        return translation;
      }
    }

    return msgidFn(docOrMsgId); // return the untranslated attribute
  };
}


export function addTranslationHelper(
  { attributeName, attributePathFn, collection, defaultLocale, msgidFn }
) {
  check(attributeName, String);
  check(attributePathFn, Function);
  check(collection, Mongo.Collection);
  check(defaultLocale, String);
  check(msgidFn, Function);

  const resourceSlug = resourceSlugForCollection(collection);

  const helperName = `getLocalized${s.capitalize(attributeName.replace(/^_/, ''))}`;
  const helper = createTranslationHelper({
    resourceSlug,
    defaultLocale,
    attributePathFn,
    msgidFn,
    getTranslationFn(locale, doc) {
      return get(doc, attributePathFn(locale));
    },
  });

  collection.helpers({
    [helperName](locale) { return helper(locale, this); },
  });

  console.log(`Added \`${helperName}\` helper function on ${collection._name} documents.`);
}
