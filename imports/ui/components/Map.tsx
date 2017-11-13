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
import PlaceDetailsContainer from './PlaceDetailsContainer';
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
  onPlaceDetailsChanged?: (options: { placeInfo: IPlaceInfo | null, visible: boolean }) => void;
  enablePlaceDetails?: boolean;
}

interface IMapState {
  feature: IPlaceInfo | null | undefined;
  leafletMap: L.Map | null;
}

class Map extends React.Component<IStyledComponent & IMapProps, IMapState> {
  state: IMapState = {
    feature: null,
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
          featureId={this.state.feature && this.state.feature.properties && this.state.feature.properties._id}
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
        <PlaceDetailsContainer
          className="place-details-container"
          feature={this.state.feature}
          onClose={this.dismissPlaceDetails}
        />
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
    if (this.props.enablePlaceDetails === false) {
      return;
    }

    console.log('You clicked the marker', featureId);
    accessibilityCloudFeatureCache.getFeature(featureId).then((feature: IPlaceInfo) => {
      this.setState({feature: feature});
      if (this.props.onPlaceDetailsChanged) {
        this.props.onPlaceDetailsChanged({
          placeInfo: feature, visible: true,
        });
      }
    }, (reason) => {
      console.error('Failed loading feature', reason);
    });
  };

  private dismissPlaceDetails = () => {
    this.setState({feature: null});
    if (this.props.onPlaceDetailsChanged) {
      this.props.onPlaceDetailsChanged({
        placeInfo: null, visible: false,
      });
    }
  }

  private createMarkerFromFeature = (feature: IPlaceInfo, latlng: [number, number]) => {
    const properties = feature && feature.properties;
    if (!properties) {
      return null;
    }

    return new HighlightableMarker(latlng, {
      onClick: this.onMarkerClick,
      hrefForFeatureId: () => {
        return this.props.enablePlaceDetails === false ? '' : '#';
      },
      feature,
    });
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

