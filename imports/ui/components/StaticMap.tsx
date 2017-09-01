import {Meteor} from 'meteor/meteor';
import {Component} from 'react';
import * as React from 'react';
import { StaticMap as StaticMapGL } from 'react-map-gl';

interface IMapProps {
  className?: string;
  containerWidth?: number;
  containerHeight?: number;
  initialLatitude?: number;
  initialLongitude?: number;
}

interface IMapState {
  viewport: {
    zoom: number;
    bearing: number;
    pitch: number;
    latitude: number;
    longitude: number;
  };
  settings: {
    dragPan: boolean,
    dragRotate: boolean,
    scrollZoom: boolean,
    touchZoomRotate: boolean,
    doubleClickZoom: boolean,
    minZoom: number,
    maxZoom: number,
    minPitch: number,
    maxPitch: number,
  };
}

class StaticMap extends Component<IMapProps, IMapState> {
  public state = {
    viewport: {
      zoom: 11,
      bearing: 0,
      pitch: 0,
      latitude: 52.47393,
      longitude: 13.36595,
    },
    settings: {
      dragPan: true,
      dragRotate: true,
      scrollZoom: true,
      touchZoomRotate: true,
      doubleClickZoom: true,
      minZoom: 0,
      maxZoom: 20,
      minPitch: 0,
      maxPitch: 85,
    },
  };

  public render(): JSX.Element {
    return (
      <div className={this.props.className || ''} data-component="Map">                
        <StaticMapGL
          {...this.state.viewport}
          {...this.state.settings}
          width={this.props.containerWidth || 100}
          height={this.props.containerHeight || 100}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxApiAccessToken={Meteor.settings.public.mapbox} />
      </div>
    );
  }

  private updateViewport = (viewport) => {
    this.setState({viewport});
  }
};

export default StaticMap;
