import { t } from 'c-3po';
import * as L from 'leaflet';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import * as React from 'react';
import * as moment from 'moment';
import ClipboardButton from 'react-clipboard.js';
import { browserHistory } from 'react-router';

import Map from '../../components/Map';
import Button from '../../components/Button';
import { colors } from '../../stylesheets/colors';
import MapLayout from '../../layouts/MapLayout';
import { regionToBbox } from '../../../both/lib/geo-bounding-box';
import { defaultRegion } from './EventBaseForm';
import EventStatistics from './EventStatistics';
import EventMiniMarker from './EventMiniMarker';
import { IOrganization } from '../../../both/api/organizations/organizations';
import { IEvent, Events } from '../../../both/api/events/events';
import { IStyledComponent } from '../../components/IStyledComponent';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import { default as PublicHeader, HeaderTitle } from '../../components/PublicHeader';
import { reactiveSubscriptionByParams, IAsyncDataByIdProps } from '../../components/reactiveModelSubscription';

interface IPageModel {
  organization: IOrganization;
  event: IEvent;
};

const PublicEventHeader = (props: { event: IEvent, organization: IOrganization }) => (
  <PublicHeader
    titleComponent={(
      <HeaderTitle
        title={props.event.name}
        subTitle={moment(props.event.startTime).format('LLL')}
        description={props.event.description}
        prefixTitle={props.organization.name}
        logo={props.organization.logo}
        prefixLink={`/organizations/${props.organization._id}`}
      />
    )}
    action={(<HeaderShareAction />)}
    organizeLink={props.event.editableBy(Meteor.userId()) ? `/events/${props.event._id}/organize` : undefined}
  />
);

const OngoingEventHeader = (props: { event: IEvent }) => (
  <div>
    <EventStatistics
      event={props.event}
      achieved={true}
      countdown={'full'} />
  </div>
);

const OngoingEventMapContent = () => (
  <div className="map-overlay">
  </div>
);

const HeaderShareAction = () => (
  <div>
    <ClipboardButton className="btn btn-dark"
      data-clipboard-text={window.location.href}
      onSuccess={() => {
        toast.success(t`Link copied to clipboard`);
      }}>
      {t`Share Link`}
    </ClipboardButton>
    <Button className="join-button btn-primary" to="">{t`Join Event`}</Button>
  </div>
);

const FinishedEventMapContent = (props: { event: IEvent }) => {
  const barGraphAchieved =
    props.event.statistics && props.event.targets &&
      props.event.targets.mappedPlacesCount && props.event.targets.mappedPlacesCount > 0 ?
      Math.floor(100 * props.event.statistics.mappedPlacesCount / props.event.targets.mappedPlacesCount) : null;

  return (
    <div className="event-stats">
      <div className="event-picture-container">
        {props.event.photoUrl ? <img src={props.event.photoUrl} alt={t`Event picture`} /> : null}
        <section className="image-overlay">
          <div className="participant-count">
            {props.event.statistics ? props.event.statistics.acceptedParticipantCount : 0}
          </div>
          <div className="participants-block">
            <section className="participants-label">
              {t`Participants`}
            </section>
            <section className="participants-icons">
              {Array(props.event.statistics ? (props.event.statistics.acceptedParticipantCount + 1) : 0).join('p ­')}
            </section>
          </div>
        </section>
      </div>
      <div className="stats-box">
        <div className="places-block">
          <section className="poi-icon" />
          <section className="planned-label">
            <p>{props.event.targets ? props.event.targets.mappedPlacesCount : 0}</p>
            <small>{t`Planned`}</small>
          </section>
          <section className="achieved-label">
            <p>{props.event.statistics ? props.event.statistics.mappedPlacesCount : 0}</p>
            <small>{t`Achieved`}</small>
          </section>
        </div>
        {barGraphAchieved !== null ?
          <div className="places-graph">
            <section style={{ width: t`${barGraphAchieved}%` }} className="bar-graph-achieved" />
            <section style={{ width: t`${100 - barGraphAchieved}%` }} className="bar-graph-planned" />
          </div>
          : null
        }
      </div>
    </div>
  );
}

const ShowEventPage = (props: IAsyncDataByIdProps<IPageModel> & IStyledComponent) => {
  const event = props.model.event;
  const organization = props.model.organization;
  const bbox = regionToBbox(event.region || defaultRegion);

  return (
    <MapLayout className={props.className}>
      <PublicEventHeader event={event} organization={organization} />
      {event.status == 'ongoing' ? <OngoingEventHeader event={event} /> : null}
      {event.status == 'planned' ? <OngoingEventHeader event={event} /> : null}
      <div className="content-area">
        <Map
          bbox={bbox}>
          <EventMiniMarker
            event={event}
            additionalLeafletLayers={[L.rectangle(bbox, {
              className: 'event-bounds-polygon',
              interactive: false,
            })]}
          />
        </Map>
        <div className="map-overlay">
          {event.status == 'completed' ? <FinishedEventMapContent event={event} /> : null}
          {event.status == 'ongoing' ? <OngoingEventMapContent /> : null}
          {event.status == 'planned' ? <OngoingEventMapContent /> : null}
        </div>
      </div>
    </MapLayout>
  );
}
  ;

const ReactiveShowEventPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(ShowEventPage),
  (id): IPageModel | null => {
    const event = Events.findOne(id);
    const organization = event ? event.getOrganization() : null;
    // fetch model with organization & events in one go
    return event && organization ? { organization, event } : null;
  }, 'events.by_id.public', 'organizations.by_eventId.public', 'users.my.private');

export default styled(ReactiveShowEventPage) `
  .event-date {
    background-color: white;
  }

  .map-overlay {  
    display: flex;
    justify-content: center;
    align-content: center;
    
    .event-stats {
      width: 400px;    
      position: absolute;
      right: 10px;
      bottom: 40px;
      background-color: white;
      box-shadow: 0 0 2px 0 rgba(55,64,77,0.40);
      
      .stats-box {
        padding: 10px;
      }

      .places-block {
        display: flex;
        justify-content: space-between;
        
        .poi-icon {
          content: " ";
          width: 42px;
          height: 42px;
          background-image: url(/images/icon-location@2x.png); 
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        
        section {
          text-align: center;

          p {
            margin: 0;
            padding-top: 4px;
            font-size: 32px;
            line-height: 28px;
            font-weight: 200;
          }

          small {
            font-size: 11px;
            line-height: 11px;
            font-weight: 300;
            text-transform: uppercase;
          }
        }

        section.achieved-label p {
          font-weight: 800;
        }
      }
 
      .places-graph {
        margin-top: 4px;
        border: 1px black solid;
        line-height: 0;
        
        section {
          width: 30%;
          height: 18px;      
          padding-right: 4px;
          line-height: 18px;
          display: inline-block;
          text-align: right;
          font-weight: 400;
        }
        
        .bar-graph-achieved {
          background-color: ${colors.ctaGreen};
          color: white;
          padding: 0;
        }
        .bar-graph-remaining {
          background-color: ${colors.errorRed};
          color: white;
          padding: 0;
        }
      }
      
      .event-picture-container {
        position: relative;
        
        img {
          min-height: 88px;
          width: 100%;
        }
        
        section.image-overlay {
          position: absolute;
          color: white;
          bottom: 0px;
          padding: 10px;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.4);
          
          .participant-count {
            font-size: 42px;
            font-weight: 800;
            line-height: 36px;
          }
          
          .participants-block {
            margin-right: 10px;
            display: flex;
            justify-content: flex-start;
            
            section.participants-label {
              margin-right: 10px;
              margin-top: 4px;
              font-weight: 400;
              font-size: 11px;
              line-height: 14px;
              text-transform: uppercase;
            }

            section.participants-icons {          
              margin-right: 10px;
              font-family: 'iconfield-v03';
              font-size: 11px;
            }
          }
        }
      }
    }

    .join-button {
      margin: auto;    
      box-shadow: 0 0 7px 1px rgba(0,0,0,0.4);
    }
  }

  
`;
