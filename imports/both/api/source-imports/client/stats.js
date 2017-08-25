import { SourceImports } from '../source-imports';
import sortBy from 'lodash/sortBy';
import get from 'lodash/get';

const attributeDistributionCache = {};

SourceImports.helpers({
  getCachedAttributeDistribution() {
    const cache = attributeDistributionCache;
    cache[this._id] = cache[this._id] || this.getAttributeDistribution();
    return attributeDistributionCache[this._id];
  },
  getAttributeDistribution() {
    return this.attributeDistribution && JSON.parse(this.attributeDistribution);
  },
  mostFrequentCategoryNamesToPlaceCounts(limit = 10) {
    const attributeDistribution = this.getCachedAttributeDistribution();
    if (!attributeDistribution) { return []; }
    const categoryNamesToCounts = attributeDistribution.properties.properties.category;
    const categoryNames = Object.keys(categoryNamesToCounts);
    const countForCategoryName = (name) => categoryNamesToCounts[name];
    return sortBy(categoryNames, countForCategoryName)
      .reverse()
      .slice(0, limit)
      .map(name => ({ name, count: countForCategoryName(name) }));
  },
  placeCountsByAccessibilityType() {
    const attributeDistribution = this.getCachedAttributeDistribution();
    if (!attributeDistribution) { return []; }
    const source = this.getSource();
    if (!source) {
      return [];
    }
    const totalCount = this.getSource().placeInfoCount;
    const typeNamesToCounts =
      get(attributeDistribution, 'properties.properties.accessibility.accessibleWith');
    return Object.keys(typeNamesToCounts || {})
      .map(name => ({
        name,
        false: typeNamesToCounts[name].false,
        true: typeNamesToCounts[name].true,
        unknown: totalCount - typeNamesToCounts[name].true - typeNamesToCounts[name].false,
      }));
  },
});
