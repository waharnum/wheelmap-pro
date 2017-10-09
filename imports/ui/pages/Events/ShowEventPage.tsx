import * as React from 'react';
import styled from 'styled-components';
import * as moment from 'moment';
import {t} from 'c-3po';

import MapLayout from '../../layouts/MapLayout';
import Map from '../../components/Map';
import Button from '../../components/Button';
import {Countdown} from '../../components/Countdown';
import {IEvent, Events} from '../../../both/api/events/events';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {IOrganization} from '../../../both/api/organizations/organizations';
import {default as PublicHeader, HeaderTitle} from '../../components/PublicHeader';
import {reactiveSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';
import {colors} from '../../stylesheets/colors';

interface IPageModel {
  organization: IOrganization;
  event: IEvent;
};

const PublicEventHeader = (props: { event: IEvent, organization: IOrganization }) => (
  <PublicHeader
    titleComponent={(
      <HeaderTitle
        title={props.event.name}
        description={props.event.description}
        prefixTitle={props.organization.name}
        logo={props.organization.logo}
        prefixLink={`/organizations/${props.organization._id}`}
      />
    )}
    action={(<HeaderShareAction/>)}
    organizeLink={`/events/${props.event._id}/organize`}
  />
);

const OngoingEventHeader = (props: { event: IEvent }) => (
  <div>
    <div className="event-date">{moment(props.event.startTime).format('LLLL')}</div>
    <Countdown start={moment(props.event.startTime)}/>
  </div>
);

const OngoingEventMapContent = () => (
  <div className="map-overlay">
    <Button className="join-button btn-primary" to="">{t`Join Us`}</Button>
  </div>
);

const HeaderShareAction = () => (
  <Button className="btn-primary" to="">{t`Share…`}</Button>
);

const FinishedEventMapContent = (props: { event: IEvent }) => (
  <div className="event-stats">
    <div className="event-picture-container">
      {props.event.photoUrl?<img src={props.event.photoUrl} alt={t`Event picture`} />:null}
      <section className="image-overlay">
        <div className="participant-count">18</div>
        <div className="participants-block">
          <section className="participants-label">{t`Participants`}</section>
          <section className="participants-icons">{Array(18).join('p ­')}</section>
        </div>
      </section>
    </div>
    <div className="stats-box">
      <div className="places-block">
        <section className="poi-icon"></section>
        <section className="planned-label">
          <p>{40}</p>
          <small>{t`Planned`}</small>
        </section>
        <section className="achieved-label">
          <p>{96}</p> 
          <small>{t`Achieved`}</small>
        </section>
      </div>
      <div className="places-graph">
        <section style={{width: '60%'}} className="line-graph-achieved">{60}%</section>
        <section style={{width: '20%'}} className="line-graph-failed">{20}%</section>
        <section style={{width: '20%'}} className="line-graph-remaining">{20}%</section>
      </div>
    </div>
  </div>
);

const ShowEventPage = (props: IAsyncDataByIdProps<IPageModel> & IStyledComponent) => {
  const event = props.model.event;
  const organization = props.model.organization;
  const showResultPage = event.startTime ? event.startTime < new Date() : false;

  return (
    <MapLayout className={props.className}>
      <PublicEventHeader event={event} organization={organization}/>
      {showResultPage ? null : <OngoingEventHeader event={event}/>}
      <div className="content-area">
        <Map/>
        <div className="map-overlay">
          {showResultPage ? <FinishedEventMapContent event={event}/> : <OngoingEventMapContent/>}
        </div>
      </div>
    </MapLayout>
  );
};

const ReactiveShowEventPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(ShowEventPage),
  (id): IPageModel | null => {
    const event = Events.findOne(id);
    const organization = event ? event.getOrganization() : null;
    // fetch model with organization & events in one go
    return event && organization ? {organization, event} : null;
  }, 'events.by_id.public', 'organizations.by_eventId.public');

export default styled(ReactiveShowEventPage) `
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
        
        section {
          width: 30%;
          height: 18px;      
          padding-right: 4px;
          line-height: 18px;
          display: inline-block;
          text-align: right;
          font-weight: 400;
        }
        
        .line-graph-achieved {
          background-color: ${colors.ctaGreen};
          color: white;
        }
        .line-graph-failed {
          background-color: ${colors.errorRed};
          color: white;
        }
        .line-graph-remaining {
          background-color: lightgrey;
          color: black;
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
