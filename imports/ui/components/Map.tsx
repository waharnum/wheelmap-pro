import * as React from 'react';

import ReactWheelmapMap from 'wheelmap-react/lib/components/Map/Map';
import HighlightableMarker from 'wheelmap-react/lib/components/Map/HighlightableMarker';
import {yesNoLimitedUnknownArray, yesNoUnknownArray} from 'wheelmap-react/lib/lib/Feature';
import {accessibilityCloudFeatureCache} from 'wheelmap-react/lib/lib/cache/AccessibilityCloudFeatureCache';

import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/src/L.Control.Locate.scss';
import 'wheelmap-react/src/Map.css'

import styled from 'styled-components';
import {IStyledComponent} from './IStyledComponent';
import {IPlaceInfo} from '../../both/api/place-infos/place-infos';
import {PropTypes} from 'react';

interface IMapProps {
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
  selectedPlace?: IPlaceInfo | null,
}

interface IMapState {
  leafletMap: L.Map | null;
}

class Map extends React.Component<IStyledComponent & IMapProps, IMapState> {
  state: IMapState = {
    leafletMap: null,
  }
  private leafletMap: L.Map;

  public componentWillReceiveProps(nextProps, nextContext) {
    const applyBbox =
      nextProps.bbox &&
      !nextProps.bbox.equals(this.leafletMap.getBounds()) &&
      !nextProps.bbox.equals(this.props.bbox);

    if (applyBbox) {
      this.repositionMap(nextProps);
    }
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
          wheelmapApiBaseUrl={false}
          mapboxTileUrl={`https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${Meteor.settings.public.mapbox}`}
          accessibilityCloudAppToken={Meteor.settings.public.accessibilityCloud}
          accessibilityCloudTileUrl={this.buildAccessibilityCloudTileUrl()}
          wheelmapApiKey={Meteor.settings.public.wheelmap}
          accessibilityFilter={[].concat(yesNoLimitedUnknownArray)}
          toiletFilter={[].concat(yesNoUnknownArray)}
          locateOnStart={false}
          pointToLayer={this.createMarkerFromFeature}
        />
        {this.props.children}
      </section>
    );
  }

  private buildAccessibilityCloudTileUrl = () => {
    if (this.props.accessibilityCloudTileUrlBuilder) {
      return this.props.accessibilityCloudTileUrlBuilder();
    }
    return `https://www.accessibility.cloud/place-infos?x={x}&y={y}&z={z}&appToken=${Meteor.settings.public.accessibilityCloud}`
  }

  private onMoveEnd = (options: { zoom: number, lat: number, lon: number, bbox: L.LatLngBounds }) => {
    if (this.props.onMoveEnd) {
      this.props.onMoveEnd(options);
    }
  };

  private onMapMounted = (map: L.Map) => {
    this.leafletMap = map;
    this.setState({leafletMap: map});
    this.repositionMap(this.props);
  }

  private repositionMap(props: IMapProps) {
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
      hrefForFeatureId: () => {
        return '';
      },
      feature,
    });

    return marker;
  }

  public static childContextTypes = {
    map: PropTypes.instanceOf(L.Map),
  }

  public getChildContext() {
    return {
      map: this.state.leafletMap,
    }
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

