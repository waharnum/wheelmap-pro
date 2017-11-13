import * as L from 'leaflet';
import styled from 'styled-components';
import * as React from 'react';
import * as moment from 'moment';

import {CustomMapPopup} from '../../components/MapPopup';
import {IEvent} from '../../../both/api/events/events';
import EventStatistics from '../Events/EventStatistics';
import {regionToBbox} from '../../../both/lib/geo-bounding-box';
import {defaultRegion} from './EventBaseForm';
import {colors} from '../../stylesheets/colors';

interface IEventMapPopupProps {
  event: IEvent;
  primaryAction?: string;
  onPrimaryAction?: () => void;
  hasMore?: boolean;
  onNextSelected?: () => void;
  onPrevSelected?: () => void;
}

class EventMapPopup extends React.Component<IEventMapPopupProps> {
  public render() {
    const event = this.props.event;

    const bbox = regionToBbox(event.region || defaultRegion);
    const mapPos = bbox.getCenter();

    return (
      <CustomMapPopup
        className="event-marker"
        lat={mapPos.lat}
        lon={mapPos.lng}
        additionalLeafletLayers={[L.rectangle(bbox, {
          className: 'event-bounds-polygon',
          interactive: false,
        })]}
      >
        {this.props.hasMore ?
          <button className='btn btn-primary btn-prev-event'
                  onClick={this.props.onPrevSelected}>{'<'}</button> : null}
        <div className="event-information">
          <div className="event-description">
            <h3>{event.name} ({event.status})</h3>
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
                  onClick={this.props.onNextSelected}>{'>'}</button> : null}
      </CustomMapPopup>);
  }
}

const BubbleNoseSize = 10;

export default styled(EventMapPopup) `

.event-marker { 
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
    background: #fbfaf9;    
    border-radius: 5px;
    // box-shadow: 0 0 2px 0 rgba(55,64,77,0.40);
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    
    .btn-prev-event, .btn-next-event {
      position: absolute;
      top: calc(50% - 25px);
      width: 50px;
      height: 50px;
    }
    
    .btn-prev-event {
      left: -50px;
    }
    
    .btn-next-event {    
      left: 100%;
    }

    .event-information {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      
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
}
`;
