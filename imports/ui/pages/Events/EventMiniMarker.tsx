import * as L from 'leaflet';
import styled from 'styled-components';
import * as React from 'react';

import {regionToBbox} from '../../../both/lib/geo-bounding-box';
import {CustomMapIcon} from '../../components/MapIcon';
import {IStyledComponent} from '../../components/IStyledComponent';
import {IEvent} from '../../../both/api/events/events';
import {defaultRegion} from '../../../both/api/events/schema';

interface IMarkerProps {
  event: IEvent;
  onClick?: () => void;
  additionalLeafletLayers?: Array<L.Layer>;
}

const EventMiniMarker = (props: IMarkerProps & IStyledComponent) => {
  const bbox = regionToBbox(props.event.region || defaultRegion);
  const mapPos = bbox.getCenter();

  return (
    <CustomMapIcon className={`event-mini-marker ${props.className}`}
                   lat={mapPos.lat}
                   lon={mapPos.lng}
                   onClick={props.onClick}
                   additionalLeafletLayers={props.additionalLeafletLayers}
    >
      <section className="glyphicon">*</section>
    </CustomMapIcon>);
}

const BubbleNoseSize = 5;

export default styled(EventMiniMarker) `

  .marker-root:after {
    content: "";
    position: absolute;
    box-shadow: 0px 0px 2px rgba(55,64,77,0.40);
    transform: rotate(45deg);
    bottom: -${BubbleNoseSize}px;
    left: calc(50% - ${BubbleNoseSize}px);
    border-width: ${BubbleNoseSize}px;
    border-style: solid;
    border-color: transparent white white transparent;
  }
  
  .marker-root {
    padding: 8px 8px 0 8px;
    background: white;
    box-shadow: 0 0 2px 0 rgba(55,64,77,0.40);
    transform: translate3d(-50%,calc(-100% - ${BubbleNoseSize}px), 0px);
  }
  
  .glyphicon {
    display: block;
    background: white;
    padding-bottom: 8px;
    z-index: 100;
    width: 15px;
    text-align: center;
    position: relative;
  }
  
  &.leaflet-interactive .marker-root:hover:after {
    border-color: transparent #29A3CB #29A3CB transparent;
  }
  
  &.leaflet-interactive .marker-root:hover, 
  &.leaflet-interactive .marker-root:hover .glyphicon {
    background: #29A3CB;
    color: white;
  }
  
`;
