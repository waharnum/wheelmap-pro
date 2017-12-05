import styled from 'styled-components';
import * as React from 'react';
import * as L from 'leaflet';
import connectField from 'uniforms/connectField';
import {PointGeometry} from '@sozialhelden/ac-format';

import {IStyledComponent} from '../IStyledComponent';
import Map from '../Map';
import {colors} from '../../stylesheets/colors';

type Props = {
  onChange: (value: (PointGeometry & { toString: () => string }) | null) => void,
  value: Partial<PointGeometry>;
};

const PlaceOnMapQuestion = class extends React.Component<IStyledComponent & Props> {
  public render() {
    return (
      <Map
        lon={this.props.value.coordinates && this.props.value.coordinates[0]}
        lat={this.props.value.coordinates && this.props.value.coordinates[1]}
        zoom={19}
        onMoveEnd={(options: { zoom: number, lat: number, lon: number, bbox: L.LatLngBounds }) => {

          const asString = `Lat ${options.lat.toFixed(4)} Lon ${options.lon.toFixed(4)}`;
          this.props.onChange({
            type: 'Point',
            coordinates: [options.lon, options.lat],
            toString: () => {
              return asString;
            },
          });
        }}
        className={this.props.className}>
        <div className="ac-big-icon-marker">?</div>
      </Map>
    );
  }
};

const PlaceOnMapQuestionField = connectField(PlaceOnMapQuestion);

export default styled(PlaceOnMapQuestionField) `
  height: 50vh;
  margin-top: 16px;
  
  .ac-big-icon-marker {
    left: calc(50% - 25px);
    top: calc(50% - 25px);
    z-index: 10000;
    background: ${colors.linkBlueDarker};
    
    &:after {
      background: ${colors.linkBlueDarker};
    }
  }
  
  .leaflet-control-attribution {
    display: none;
  }
`;
