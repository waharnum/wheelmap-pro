import cloneDeep from 'lodash/cloneDeep';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import {t} from 'c-3po';
import { isAdmin } from '/imports/both/lib/is-admin';
import { syncWithTransifex } from './sync';
import { resourceSlugForCollection } from './resource-slug';

function syncCollectionWithTransifex({ attributePathFn, collection, defaultLocale, msgidFn }) {
  const resourceSlug = resourceSlugForCollection(collection);

  const getTranslationForDocFn = (doc, locale) => doc.translations[locale];
  const updateLocalDocumentFn = ({ doc, locale, msgstr }) => {
    const modifierOriginal = { $set: { [attributePathFn(locale)]: msgstr } };
    const modifier = cloneDeep(modifierOriginal);
    try {
      collection.update(doc._id, modifier);
    } catch (error) {
      console.error(
        'Error while updating',
        (collection && collection._name),
        'document',
        doc && doc._id,
        'with modifier',
        modifier,
        'original modifier:',
        modifierOriginal,
        'schema:',
        collection.schema,
      );
      throw error;
    }
  };

  const msgidsToDocs = {};
  collection.find().fetch().filter(doc => doc.translations)
    .forEach(doc => {
      const msgid = msgidFn(doc);
      msgidsToDocs[msgid] = doc;
    });

  syncWithTransifex({
    defaultLocale, msgidsToDocs, resourceSlug, updateLocalDocumentFn, getTranslationForDocFn,
  });
}


export function addRPCMethodForSyncing(
  { attributePathFn, collection, defaultLocale, msgidFn }
) {
  check(attributePathFn, Function);
  check(collection, Mongo.Collection);
  check(defaultLocale, String);
  check(msgidFn, Function);

  const methodName = `${collection._name}.syncWithTransifex`;

  Meteor.methods({
    [methodName]() {
      if (!this.userId) {
        throw new Meteor.Error(401, t`Please log in first.`);
      }
      if (!isAdmin(this.userId)) {
        throw new Meteor.Error(403, t`You are not authorized to import categories.`);
      }
      return syncCollectionWithTransifex(
        { collection, attributePathFn, msgidFn, defaultLocale }
      );
    },
  });

  console.log(`Registered \`${methodName}\` method.`);
}
