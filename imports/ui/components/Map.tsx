import * as React from 'react';

import ReactWheelmapMap from 'wheelmap-react/lib/components/Map/Map';
import HighlightableMarker from 'wheelmap-react/lib/components/Map/HighlightableMarker';
import {yesNoLimitedUnknownArray, yesNoUnknownArray} from 'wheelmap-react/lib/lib/Feature';

import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/src/L.Control.Locate.scss';
import 'wheelmap-react/src/Map.css'

import styled from 'styled-components';
import {IStyledComponent} from './IStyledComponent';

interface IMapProps {
  accessibilityCloudTileUrlBuilder?: () => string | false;
};

class Map extends React.Component<IStyledComponent & IMapProps> {
  public render(): JSX.Element {
    return (
      <ReactWheelmapMap
        className={`wheelmap-map ${this.props.className}`}
        data-component="Map"
        minZoomWithSetCategory={13}
        minZoomWithoutSetCategory={16}
        zoom={10}
        maxZoom={19}
        lat={52.541017}
        lon={13.38609}
        wheelmapApiBaseUrl={false}
        mapboxTileUrl={`https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${Meteor.settings.public.mapbox}`}
        accessibilityCloudAppToken={Meteor.settings.public.accessibilityCloud}
        accessibilityCloudTileUrl={this.buildAccessibilityCloudTileUrl()}
        wheelmapApiKey={Meteor.settings.public.wheelmap}
        accessibilityFilter={[].concat(yesNoLimitedUnknownArray)}
        toiletFilter={[].concat(yesNoUnknownArray)}
        locateTimeout={500}
        pointToLayer={this.createMarkerFromFeature}
      />
    );
  }

  private buildAccessibilityCloudTileUrl = () => {
    if (this.props.accessibilityCloudTileUrlBuilder) {
      return this.props.accessibilityCloudTileUrlBuilder();
    }
    return `https://www.accessibility.cloud/place-infos?x={x}&y={y}&z={z}&appToken=${Meteor.settings.public.accessibilityCloud}`
  }

  private onMarkerClick = (featureId: string) => {
    console.log('You clicked the marker', featureId)
  };

  private createMarkerFromFeature = (feature: any, latlng: [number, number]) => {
    const properties = feature && feature.properties;
    if (!properties) {
      return null;
    }

    return new HighlightableMarker(latlng, {
      onClick: this.onMarkerClick,
      hrefForFeatureId: () => {
        return ''
      },
      feature,
    });
  }
};

export default styled(Map)`
  .ac-marker {
    display: flex !important;
  }
`;

