import {cloneDeep, set, omit} from 'lodash';
import {geoDistance} from '../../../lib/geo-distance';
import {Sources} from '../../sources/sources';
import {
  pathsInObject,
  getTranslationForAccessibilityAttribute,
} from '../../../../server/i18n/ac-format-translations';
import {Categories} from '../../categories/categories';
import {IPlaceInfo, PlaceInfos} from '../place-infos';

const helpers = {
  getLocalizedCategory(locale) {
    const category = Categories.findOne(this.properties.category);
    if (!category) {
      console.log(`Category ${this.properties.category} not found.`);
      return '';
    }
    return category.getLocalizedId(locale);
  },
  getLocalizedAccessibility(locale) {
    const result = cloneDeep(this.properties.accessibility);
    const paths = pathsInObject(result);
    paths.forEach(path => {
      set(result, `${path}Localized`, getTranslationForAccessibilityAttribute(path, locale));
    });
    return result;
  },
};


// Convert a given plain MongoDB document (not transformed) into a GeoJSON feature
export const convertToGeoJSONFeature = (doc: IPlaceInfo, coordinatesForDistance, locale) => {
  let properties = Object.assign({} as {
    distance?: number,
    localizedCategory?: string,
    accessibility?: any,
  }, doc.properties, doc);
  if (coordinatesForDistance && properties.geometry && properties.geometry.coordinates) {
    properties.distance = geoDistance(coordinatesForDistance, properties.geometry.coordinates);
  }
  if (locale) {
    properties.localizedCategory = helpers.getLocalizedCategory.call(doc, locale);
    properties.accessibility = helpers.getLocalizedAccessibility.call(doc, locale);
  }
  delete properties.properties;
  return {
    type: 'Feature',
    geometry: properties.geometry,
    properties: omit(properties, 'geometry', 'originalData'),
  };
};

export const wrapAPIResponse = ({results, req, related, resultsCount}) => {
  // This is checked in buildSelectorAndOptions already, so no extra check here
  let coordinates;
  if (req.query.latitude && req.query.longitude) {
    coordinates = [Number(req.query.longitude), Number(req.query.latitude)];
  }

  const locale = req.query.locale;

  return {
    type: 'FeatureCollection',
    featureCount: results.length,
    totalFeatureCount: resultsCount,
    related,
    features: results.map(doc => convertToGeoJSONFeature(doc, coordinates, locale)),
  };
};

export const PlaceInfosRelationships = {
  belongsTo: {
    source: {
      foreignCollection: Sources,
      foreignKey: 'properties.sourceId',
    },
  },
};

PlaceInfos.helpers(helpers);

export const PlaceInfosIncludePathsByDefault = ['source.license'];
