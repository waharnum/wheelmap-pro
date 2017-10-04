import {distanceSearchSelector} from './distance-search';
import {mapTileSelector} from './map-tile';
import {sourceFilterSelector} from './source-filter';
import {filterPresetSelector} from './filter-preset';


export const PlaceInfosApiParameterizedSelector = (visibleContentSelector, req) =>
  ({
    $and: [
      sourceFilterSelector(req),
      visibleContentSelector,
      distanceSearchSelector(req),
      mapTileSelector(req),
      filterPresetSelector(req),
    ].filter(s => Object.keys(s).length > 0),
  });
