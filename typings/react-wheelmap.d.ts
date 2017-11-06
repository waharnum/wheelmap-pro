declare module 'wheelmap-react/lib/components/Map/Map' {
  import * as React from 'react';
  import * as L from 'leaflet';

  export interface Feature {
    _id: Mongo.ObjectID;
    properties: {
      _id: Mongo.ObjectID;
      infoPageUrl: string;
      originalId: string;
      category: string;
      name: string;
      address: string;
      originalData: any;
      sourceId: Mongo.ObjectID;
      sourceImportId: Mongo.ObjectID;
      accessibility?: any;
    };
    geometry: {
      type: string;
      coordinates: [number, number];
    }
  }

  export type YesNoLimitedUnknown = 'yes' | 'no' | 'limited' | 'unknown';
  export type YesNoUnknown = 'yes' | 'no' | 'unknown';

  interface MapProps {
    featureId?: null | undefined | string | Mongo.ObjectID;
    feature?: null | undefined | Feature;
    lat?: null | undefined | number;
    lon?: null | undefined | number;
    zoom?: null | undefined | number;
    onMoveEnd?: (params: { zoom: number; lat: number; lon: number; bbox: L.LatLngBounds }) => void;
    category: null | undefined | string;
    accessibilityFilter: YesNoLimitedUnknown[];
    toiletFilter: YesNoUnknown[];
    accessibilityCloudTileUrl: string | false;
    accessibilityCloudAppToken: string;
    wheelmapApiBaseUrl: string | false;
    wheelmapApiKey: string;
    mapboxTileUrl: string;
    maxZoom: number;
    minZoomWithSetCategory: number;
    minZoomWithoutSetCategory: number;
    defaultStartCenter: [number, number];
    pointToLayer: (feature: Feature, latlng: [number, number]) => (null | L.Marker);
    locateOnStart?: boolean;
    className: null | undefined | string;
    onMapMounted?: ((map: L.Map) => void);
  }

  type Map = React.ComponentClass<MapProps>;
  const Map: Map;

  export default Map;
}
