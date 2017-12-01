import {Mongo} from 'meteor/mongo';
import {Match} from 'meteor/check';
import SimpleSchema from 'simpl-schema';

export interface ICategory {
  _id: string,
  translations: {
    _id: {
      [language: string]: string
    }
  },
  synonyms: Array<string>,
  icon: string,
  // top-level category if empty
  parentIds?: Array<string>,
}

export const Categories = new Mongo.Collection<ICategory>('Categories');

Categories.schema = new SimpleSchema({
  icon: {
    type: String,
    label: 'Icon URL (optional)',
    regEx: /[a-z-.]+/,
  },
  synonyms: {
    type: Array,
  },
  'synonyms.$': {
    type: String,
  },
  parentIds: {
    type: Array,
  },
  'parentIds.$': {
    type: String,
  },
  translations: {
    type: Match.ObjectIncluding({}),
    blackbox: true,
  },
  'translations._id': {
    type: Match.ObjectIncluding({}),
    blackbox: true,
  },
  'translations._id.$': {
    type: String,
  },
});

Categories.attachSchema(Categories.schema);
