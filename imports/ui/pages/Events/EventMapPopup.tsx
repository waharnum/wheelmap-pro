import * as L from 'leaflet';
import styled from 'styled-components';
import * as React from 'react';
import * as moment from 'moment';

import {CustomMapPopup} from '../../components/MapPopup';
import {IEvent} from '../../../both/api/events/events';
import EventStatistics from '../Events/EventStatistics';
import {regionToBbox} from '../../../both/lib/geo-bounding-box';
import {colors} from '../../stylesheets/colors';
import {IStyledComponent} from '../../components/IStyledComponent';
import {getLabelForEventStatus} from '../../../both/api/events/eventStatus';
import {defaultRegion} from '../../../both/api/events/schema';

interface IEventMapPopupProps {
  event: IEvent;
  primaryAction?: string;
  onPrimaryAction?: () => void;
  hasMore?: boolean;
  onNextSelected?: () => void;
  onPrevSelected?: () => void;
}

class EventMapPopup extends React.Component<IEventMapPopupProps & IStyledComponent> {
  public render() {
    const event = this.props.event;

    const bbox = regionToBbox(event.region || defaultRegion);
    const mapPos = bbox.getCenter();

    return (
      <CustomMapPopup
        className={`event-marker ${this.props.className}`}
        lat={mapPos.lat}
        lon={mapPos.lng}
        additionalLeafletLayers={[L.rectangle(bbox, {
          className: 'event-bounds-polygon',
          interactive: false,
        })]}
      >
        {this.props.hasMore ?
          <button className='btn btn-primary btn-prev-event'
                  onClick={this.props.onPrevSelected}>{' '}</button> : null}
        <div className="event-information">
          <div className="event-description">
            <h3>{event.name} ({getLabelForEventStatus(event.status)})</h3>
            <h4>{moment(event.startTime).format('LL')}</h4>
            <p className="event-region">{event.regionName}</p>
            <p>{event.description}</p>
          </div>
          {this.props.primaryAction ?
            <button className='btn btn-primary'
                    onClick={this.props.onPrimaryAction}>{this.props.primaryAction}</button> : null}
        </div>
        <EventStatistics
          event={event}
          achieved={true}
          countdown={'short'}/>
        {this.props.hasMore ?
          <button className='btn btn-primary btn-next-event'
                  onClick={this.props.onNextSelected}>{' '}</button> : null}
      </CustomMapPopup>);
  }
}

const BubbleNoseSize = 10;

export default styled(EventMapPopup) `

text-align: left;

.popup-root:after {
  content: "";
  position: absolute;
  //box-shadow: 0px 0px 2px rgba(55,64,77,0.40);
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  transform: rotate(45deg);
  bottom: -${BubbleNoseSize}px;
  left: calc(50% - ${BubbleNoseSize}px);
  border-width: ${BubbleNoseSize}px;
  border-style: solid;
  border-color: transparent #fbfaf9 #fbfaf9 transparent;
}

.popup-root {
  pointer-events: auto;
  padding: 16px 16px 0 16px;
  background: ${colors.bgWhite};
  border-radius: 5px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);

  .btn-prev-event, 
  .btn-next-event {
    position: absolute;
    top: 24px;
    width: 32px;
    height: calc(100% - 48px);
    color: black;
    background: ${colors.bgWhite};    
    border-radius: 0 5px 5px 0;
    box-shadow:  inset 10px 0 10px rgba(0,0,0,0.05);
    /* opacity: 0.9;
    transition: opacity 0.25s; */

    &::before {
      position: absolute;
      content: " ";
      left: 10px;
      top: calc(50% - 24px); /*45px*/
      width: 12px;
      height: 48px;
      background-image: url(/images/chevron-big-right-dark@2x.png); 
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    &:hover,
    &:active,
    &:hover:active {
      /* opacity: 1; */
    }

    &:hover {
      width: 36px;

      &::before {
        left: 14px;
      }
    }

    &:hover:active {
      background-color: ${colors.bgWhite};
    }
  }
  
  .btn-prev-event {
    left: -32px;
    transform: scaleX(-1);

    &:hover {
      left: -36px;
      /* transition: left 0.25s; */
    }
  }
  
  .btn-next-event {    
    left: 100%;
  }

  .event-information {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    /* flex-wrap: wrap; */
    
    .event-description {         
      
      h3,
      h4 {
        margin-top: 0px;
        margin-bottom: 4px;
        font-size: 21px;
        font-weight: 300 !important;
      }
      h4 {
        opacity: 0.6;
      }
    }
    
    .time-until-event {
      text-align: center;

      p {
        margin: 0;
        font-size: 32px;
        line-height: 32px;
        font-weight: 200 !important;
      }

      small {
        font-size: 11px;
        line-height: 11px;
        font-weight: 300;
        text-transform: uppercase;
      }
    } 
  }

  .event-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    a.btn {
      margin-bottom: 10px;
      padding-right: 0;
    }
  }

  .event-statistics {
    padding-top: 20px;
    background-color: #fbfaf9;
    display: flex;
    justify-content: flex-start;
    z-index: 100;
    position: relative;
    
    &.organization-stats {
      border-bottom: 1px solid ${colors.shadowGrey};
    }

    section {
      padding: 0px 10px 0 10px;
      text-align: center;
      border-right: 1px solid ${colors.shadowGrey};
      display: flex;

      &:last-child {
        border-right: 0;
      }

      span {
        position: relative;
        padding: 0 10px 16px 10px;
        font-size: 30px;
        line-height: 30px;
        font-weight: 200;
        display: flex;
        flex-direction: column;
        align-items: center;

        &.key-figure {
          font-size: 32px;
          // font-weight: 800;
        }

        small {
          font-size: 11px;
          line-height: 11px;
          font-weight: 300;
          text-transform: uppercase;
        }
      }

      &:before {
        position: relative;
        top: 2px;
        left: 0;
        width: 27px;
        height: 27px;
        content: " ";
        background-image: url(/images/icon-person@2x.png); 
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }

    /* prefix icons*/
    section.participant-stats:before { background-image: url(/images/icon-person@2x.png); }
    section.location-stats:before { background-image: url(/images/icon-location@2x.png); }
    section.event-stats:before { background-image: url(/images/icon-date@2x.png); }
    section.new-event:before { 
      width: 0;
      height: 0;
      background-image: none; 
    }
  }
}
`;
