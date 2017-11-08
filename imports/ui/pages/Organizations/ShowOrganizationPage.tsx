import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import * as moment from 'moment';
import {Meteor} from 'meteor/meteor';

import MapLayout from '../../layouts/MapLayout';
import {browserHistory} from 'react-router';

import Map from '../../components/Map';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {reactiveSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';

import {IEvent} from '../../../both/api/events/events';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import {colors} from '../../stylesheets/colors';
import {default as PublicHeader, HeaderTitle} from '../../components/PublicHeader';
import EventStatistics from '../Events/EventStatistics';
import {regionToBbox} from '../../../both/lib/geo-bounding-box';
import {defaultRegion} from '../Events/EventBaseForm';
import * as L from 'leaflet';
import {CustomMapPopup} from '../../components/MapPopup';
import EventMiniMarker from '../Events/EventMiniMarker';

interface IMarkerProps {
  event: IEvent;
  primaryAction?: string;
  onPrimaryAction?: () => void;
  hasMore?: boolean;
  onNextSelected?: () => void;
  onPrevSelected?: () => void;
}

class EventMarker extends React.Component<IMarkerProps> {
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

interface IPageModel {
  organization: IOrganization;
  events: Array<IEvent>;
}

type PageParams = {
  params: {
    _id: string,
    event_id: string | undefined
  }
}
type PageProps = PageParams & IAsyncDataByIdProps<IPageModel> & IStyledComponent;

class ShowOrganizationPage extends React.Component<PageProps> {
  state: { placeDetailsShown: boolean } = {placeDetailsShown: false}

  public componentWillMount() {
    this.redirectToCorrectRoute(this.props);
  }

  public componentWillReceiveProps(nextProps) {
    this.redirectToCorrectRoute(nextProps);
  }

  public render() {
    const organization = this.props.model.organization;
    const events = this.props.model.events;

    let eventIndex = 0;
    if (this.props.params.event_id) {
      eventIndex = events.findIndex((e) => {
        return e._id == this.props.params.event_id;
      });
    }

    const selectedEvent = events[eventIndex];
    const nextEvent = events[(eventIndex + 1) % events.length];
    const prevEvent = events[(eventIndex + events.length - 1) % events.length];

    return (
      <MapLayout className={this.props.className}>
        <PublicHeader
          titleComponent={(
            <HeaderTitle
              title={organization.name}
              logo={organization.logo}
              description={organization.description}
            />
          )}
          organizeLink={organization.editableBy(Meteor.userId()) ? `/organizations/${organization._id}/organize` : undefined}
        />
        <div className="content-area">
          <Map
            bbox={selectedEvent ? regionToBbox(selectedEvent.region || defaultRegion) : undefined}
            onPlaceDetailsChanged={(options) => {
              this.setState({placeDetailsShown: options.visible})
            }}>
            {events.map((event) => {
              if (event._id == selectedEvent._id) {
                return (<EventMarker event={event}
                                     key={String(event._id)}
                                     primaryAction={t`Join Us!`}
                                     onPrimaryAction={() => {
                                       browserHistory.push(`/events/${event._id}`)
                                     }}
                                     onPrevSelected={() => {
                                       browserHistory.replace(`/organizations/${organization._id}/event/${prevEvent._id}`)
                                     }}
                                     onNextSelected={() => {
                                       browserHistory.replace(`/organizations/${organization._id}/event/${nextEvent._id}`)
                                     }}
                                     hasMore={events.length > 1}/>);
              }
              else {
                return (
                  <EventMiniMarker
                    event={event}
                    key={String(event._id)}
                    onClick={() => {
                      browserHistory.replace(`/organizations/${organization._id}/event/${event._id}`);
                    }}
                  />);
              }
            })}
          </Map>
        </div>
      </MapLayout>
    );
  }

  private redirectToCorrectRoute(props: PageProps) {
    // decide if the url is correct and matches our event
    const organization = props.model.organization;
    const events = props.model.events;

    if (props.params.event_id) {
      const eventIndex = events.findIndex((e) => {
        return e._id == props.params.event_id;
      });

      // current url is pointing to a missing key
      if (eventIndex == -1) {
        if (events.length > 0) {
          // take alternative first event
          browserHistory.replace(`/organizations/${organization._id}/event/${events[0]._id}`);
        } else {
          // take no event organization page
          browserHistory.replace(`/organizations/${organization._id}`);
        }
      }
    } else if (events.length > 0) {
      // select first event url
      browserHistory.replace(`/organizations/${organization._id}/event/${events[0]._id}`);
    }

  }
};

const ReactiveShowOrganizationPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(ShowOrganizationPage),
  (id): IPageModel | null => {
    const organization = Organizations.findOne(id);
    const events = organization ? organization.getEvents() : null;
    // fetch model with organization & events in one go
    return organization && events ? {organization, events: events || []} : null;
  },
  'organizations.by_id.public', 'events.by_organizationId.public', 'users.my.private');

const BubbleNoseSize = 10;

export default styled(ReactiveShowOrganizationPage) `
svg path.event-bounds-polygon {
  stroke: forestgreen;
  stroke-opacity: 0.3;
  fill: forestgreen;
  fill-opacity: 0.1;
  stroke-width: 1px;
}

.event-marker { 
  text-align: left;

  .popup-root:after {
    content: "";
    position: absolute;
    box-shadow: 0px 0px 2px rgba(55,64,77,0.40);
    -moz-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    bottom: -${BubbleNoseSize}px;
    left: calc(50% - ${BubbleNoseSize}px);
    border-width: ${BubbleNoseSize}px;
    border-style: solid;
    border-color: transparent #FFF #FFF transparent;
  }
  
  .popup-root {
    pointer-events: auto;
    padding: 16px 16px 0 16px;
    background: white;
    box-shadow: 0 0 2px 0 rgba(55,64,77,0.40);
    
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
      background-color: white;
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
