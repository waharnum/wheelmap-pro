import styled from 'styled-components';
import * as React from 'react';
import * as leaflet from 'leaflet';
import connectField from 'uniforms/connectField';

import {IStyledComponent} from './IStyledComponent';
import {formatDistance} from '../../both/lib/format-distance';

interface ILocationProps {
  value?: {
    topLeft: {
      latitude: number
      longitude: number;
    };
    bottomRight: {
      latitude: number
      longitude: number;
    };
  }
};

const MapLocation = class extends React.Component<IStyledComponent & ILocationProps> {

  public render() {
    let radius = 0;
    let center = {lat: 0, lon: 0};
    if (this.props.value && this.props.value.topLeft && this.props.value.bottomRight) {
      const tl = this.props.value.topLeft;
      const br = this.props.value.bottomRight;
      const corner1 = leaflet.latLng(tl.latitude, tl.longitude);
      const corner2 = leaflet.latLng(br.latitude, br.longitude);
      const bounds = leaflet.latLngBounds(corner1, corner2);
      const latLngCenter = bounds.getCenter();

      center = {lat: latLngCenter.lat, lon: latLngCenter.lng};
      radius = latLngCenter.distanceTo(corner1) || 1000;
    }

    return (
      <div className={'field form-group ' + this.props.className}>
        <section className="help-block">
          <section><b>Lat</b> {center.lat.toFixed(4)}</section>
          <section><b>Lon</b> {center.lon.toFixed(4)}</section>
          <section><b>Radius</b> {formatDistance(radius)}</section>
        </section>
      </div>
    );
  }
};

const MapLocationField = connectField(MapLocation, {
  ensureValue: true,
  includeInChain: false,
  initialValue: false,
});

export default styled(MapLocationField) `
  .help-block section {
    display: inline;
    padding-right: 5px;
    
    b {
      font-weight: 400;
    }
  }
`;
