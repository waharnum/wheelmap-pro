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
        lat={this.props.value.coordinates && this.props.value.coordinates[1]}
        lon={this.props.value.coordinates && this.props.value.coordinates[0]}
        accessibilityCloudTileUrlBuilder={() => false}
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
        <div className="ac-big-icon-marker">
          <span className="icon"/>
          <span className="arrow arrow-left"/>
          <span className="arrow arrow-top"/>
          <span className="arrow arrow-right"/>
          <span className="arrow arrow-bottom"/>
        </div>
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
    pointer-events: none;
    
    span {
      position: absolute;
    }
    
    span.icon {
      mask-image: url(/images/entrance.svg);
      mask-repeat: no-repeat;
      mask-size: contain;
      background: ${colors.bgWhite};
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 0px;
      margin: 10px;
    }
    
    span.arrow {
      width: 33px;
      height: 33px;    
      transform-origin: 82px 16.5px;
      background: ${colors.linkBlueDarker};
      mask-image: url(/images/back-arrow.svg);
      left: -41px;
    }
    
    span.arrow-left {
      transform: translate(-16.5px, 0px) rotate(0deg);
    }
    span.arrow-top {
      transform: translate(-16.5px, 0px) rotate(90deg);
    }
    span.arrow-right {
      transform: translate(-16.5px, 0px) rotate(180deg);
    }
    span.arrow-bottom {
      transform: translate(-16.5px, 0px) rotate(270deg);
    }
    
    &:after {
      background: ${colors.linkBlueDarker};
    }
  }
  
  .leaflet-control-attribution {
    display: none;
  }
`;
