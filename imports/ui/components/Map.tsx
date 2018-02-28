import styled from 'styled-components';
import * as React from 'react';
import {PropTypes} from 'react';
import {isEqual} from 'lodash';

import ReactWheelmapMap from 'wheelmap-react/lib/components/Map/Map';
import HighlightableMarker from 'wheelmap-react/lib/components/Map/HighlightableMarker';
import {yesNoLimitedUnknownArray, yesNoUnknownArray} from 'wheelmap-react/lib/lib/Feature';
import {accessibilityCloudFeatureCache} from 'wheelmap-react/lib/lib/cache/AccessibilityCloudFeatureCache';
import Categories from 'wheelmap-react/lib/lib/Categories';

import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/src/L.Control.Locate.scss';
import 'wheelmap-react/src/Map.css';

import {IPlaceInfo} from '../../both/api/place-infos/place-infos';
import {IStyledComponent} from './IStyledComponent';
import {i18nSettings} from '../../../client/i18n';

export type Props = {
  children?: React.ReactNode;
  accessibilityCloudTileUrlBuilder?: () => string | false;
  minZoom?: number;
  maxZoom?: number;
  zoom?: number;
  lat?: number;
  lon?: number;
  bbox?: L.LatLngBounds;
  onMoveEnd?: (options: { zoom: number, lat: number, lon: number, bbox: L.LatLngBounds }) => void;
  onBboxApplied?: () => void;
  onMarkerClick?: (placeId: string) => void;
  selectedPlace?: IPlaceInfo | null;
  locateOnStart?: boolean;
  customPlaces?: IPlaceInfo[];
}

interface State {
  leafletMap: L.Map | null;
}

import config from 'wheelmap-react/lib/lib/config';

config.wheelmapApiKey = Meteor.settings.public.wheelmap;
config.accessibilityCloudAppToken = Meteor.settings.public.accessibilityCloud;
config.accessibilityCloudBaseUrl = 'https://www.accessibility.cloud/';
config.wheelmapApiBaseUrl = `${Meteor.absoluteUrl()}/proxy/wheelmap/`;


class Map extends React.Component<IStyledComponent & Props, State> {
  state: State = {
    leafletMap: null,
  };
  private leafletMap: L.Map;
  private currentMarkerIds: string[] = [];

  public componentWillReceiveProps(nextProps, nextContext) {
    const applyBbox =
      nextProps.bbox &&
      !nextProps.bbox.equals(this.leafletMap.getBounds()) &&
      !nextProps.bbox.equals(this.props.bbox);

    if (applyBbox) {
      this.repositionMap(nextProps);
    }
    this.updatePlaces(nextProps);
  }

  public render(): JSX.Element {
    return (
      <section className={this.props.className}>
        <ReactWheelmapMap
          className={`wheelmap-map`}
          data-component="Map"
          category={null}
          minZoomWithSetCategory={this.props.minZoom || 13}
          minZoomWithoutSetCategory={this.props.minZoom || 16}
          featureId={this.props.selectedPlace && this.props.selectedPlace.properties && this.props.selectedPlace.properties._id}
          zoom={this.props.bbox ? null : (this.props.zoom)}
          maxZoom={this.props.maxZoom || 19}
          defaultStartCenter={[52.541017, 13.38609]}
          lat={this.props.bbox ? null : this.props.lat}
          lon={this.props.bbox ? null : this.props.lon}
          onMoveEnd={this.onMoveEnd}
          onMapMounted={this.onMapMounted}
          wheelmapApiBaseUrl={this.buildWheelMapBaseUrl()}
          mapboxTileUrl={`https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${Meteor.settings.public.mapbox}`}
          accessibilityCloudAppToken={Meteor.settings.public.accessibilityCloud}
          accessibilityCloudTileUrl={this.buildAccessibilityCloudTileUrl()}
          wheelmapApiKey={Meteor.settings.public.wheelmap}
          accessibilityFilter={[].concat(yesNoLimitedUnknownArray)}
          toiletFilter={[].concat(yesNoUnknownArray)}
          locateOnStart={this.props.locateOnStart === true}
          pointToLayer={this.createMarkerFromFeature}
        />
        {this.props.children}
      </section>
    );
  }

  private updatePlaces = (nextProps: Props) => {
    Categories.fetchOnce(nextProps).then(() => {
      const ids = nextProps.customPlaces ? nextProps.customPlaces.map(f => String(f._id)) : [];

      // this is a fairly stupid diff
      if (!isEqual(this.currentMarkerIds, ids)) {
        if (nextProps.customPlaces) {
          nextProps.customPlaces.forEach(
            feature => {
              feature.properties._id = feature._id;
              // this does not yet work, as no map is set on the ac layer so far
              accessibilityCloudFeatureCache.injectFeature(feature);
            });
        }
        this.currentMarkerIds = ids;
      }
    });
  };

  private buildAccessibilityCloudTileUrl = () => {
    if (this.props.accessibilityCloudTileUrlBuilder) {
      return this.props.accessibilityCloudTileUrlBuilder();
    }
    return `https://www.accessibility.cloud/place-infos?x={x}&y={y}&z={z}&appToken=${Meteor.settings.public.accessibilityCloud}&locale=${i18nSettings.bestMatchClientLocale || 'en'}`;
  };

  private buildWheelMapBaseUrl = () => {
    return `${Meteor.absoluteUrl()}/proxy/wheelmap/`;
  };

  private onMoveEnd = (options: { zoom: number, lat: number, lon: number, bbox: L.LatLngBounds }) => {
    if (this.props.onMoveEnd) {
      this.props.onMoveEnd(options);
    }
  };

  private onMapMounted = (map: L.Map) => {
    this.leafletMap = map;
    this.setState({leafletMap: map}, () => {
      this.updatePlaces(this.props);
    });
    this.repositionMap(this.props);
  };

  private repositionMap(props: Props) {
    if (props.bbox) {
      this.leafletMap.fitBounds(props.bbox, {animate: false});
      if (props.onBboxApplied) {
        props.onBboxApplied();
      }
    }
  }

  private onMarkerClick = (featureId) => {
    if (this.props.onMarkerClick) {
      this.props.onMarkerClick(featureId);
    }
  };

  private createMarkerFromFeature = (feature: IPlaceInfo, coordinates: [number, number]) => {
    const properties = feature && feature.properties;
    if (!properties) {
      return null;
    }

    const marker = new HighlightableMarker(coordinates, {
      onClick: this.onMarkerClick,
      hrefForFeature: () => {
        return '';
      },
      feature,
    });

    return marker;
  };

  public static childContextTypes = {
    map: PropTypes.instanceOf(L.Map),
  };

  public getChildContext() {
    return {
      map: this.state.leafletMap,
    };
  }
};

export default styled(Map)`
  display: flex;
  position: relative;
  width: 100%;
  
  .toolbar {
    top: 0px;
    position: absolute;
  }
`;

