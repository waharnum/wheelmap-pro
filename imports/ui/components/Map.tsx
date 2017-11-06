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

interface IMapProps {
  accessibilityCloudTileUrlBuilder?: () => string | false;
  minZoom?: number;
  maxZoom?: number;
  zoom?: number;
  lat?: number;
  lon?: number;
  bbox?: L.LatLngBounds;
  onMoveEnd?: (options: { zoom: number, lat: number, lon: number, bbox: L.LatLngBounds }) => void;
}

interface IMapState {
  feature: IPlaceInfo | null | undefined;
}

class Map extends React.Component<IStyledComponent & IMapProps, IMapState> {
  state: IMapState = {
    feature: null,
  }
  private leafletMap: L.Map;

  public componentWillReceiveProps(nextProps, nextContext) {
    const applyBbox = nextProps.bbox && !nextProps.bbox.equals(this.leafletMap.getBounds());
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
          zoom={this.props.bbox ? null : (this.props.zoom || 16)}
          maxZoom={this.props.maxZoom || 19}
          defaultStartCenter={[52.541017, 13.38609]}
          lat={this.props.bbox ? null : (this.props.lat || 52.541017)}
          lon={this.props.bbox ? null : (this.props.lon || 13.38609)}
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
        <PlaceDetailsContainer
          className="place-details-container"
          feature={this.state.feature}
          onClose={() => this.setState({feature: null})}
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
    this.repositionMap(this.props);
  }

  private repositionMap(props: IMapProps) {
    if (props.bbox) {
      this.leafletMap.fitBounds(props.bbox);
    }
  }

  private onMarkerClick = (featureId) => {
    console.log('You clicked the marker', featureId);
    accessibilityCloudFeatureCache.getFeature(featureId).then((feature: IPlaceInfo) => {
      this.setState({feature: feature});
    }, (reason) => {
      console.log('Failed', reason);
    });
  };

  private createMarkerFromFeature = (feature: IPlaceInfo, latlng: [number, number]) => {
    const properties = feature && feature.properties;
    if (!properties) {
      return null;
    }

    return new HighlightableMarker(latlng, {
      onClick: this.onMarkerClick,
      hrefForFeatureId: () => {
        // TODO what is this used for?
        return 'assas';
      },
      feature,
    });
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

