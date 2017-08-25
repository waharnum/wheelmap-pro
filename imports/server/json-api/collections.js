import groupBy from 'lodash/groupBy';
import { s } from 'meteor/underscorestring:underscore.string';

import { Apps } from '/imports/both/api/apps/apps';
import { Languages } from '/imports/both/api/languages/languages';
import { Licenses } from '/imports/both/api/licenses/licenses';
import { Organizations } from '/imports/both/api/organizations/organizations';
import { PlaceInfos } from '/imports/both/api/place-infos/place-infos';
import { SourceImports } from '/imports/both/api/source-imports/source-imports';
import { Sources } from '/imports/both/api/sources/sources';
import { Categories } from '/imports/both/api/categories/categories';

// Limits collections accessible over JSON API to a white list.

const collections = [
  Apps,
  Languages,
  Licenses,
  Organizations,
  PlaceInfos,
  SourceImports,
  Sources,
  Categories,
];

const namesToCollections = groupBy(
  collections,
  collection => s.slugify(s.humanize(collection._name))
);

// Returns a collection for a given route name (e.g. 'place-infos')
export function collectionWithName(name) {
  return namesToCollections[name];
}
