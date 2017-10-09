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
      <img src={props.event.photoUrl} alt={t`Event picture`}/>
      <section className="image-overlay">
        <div className="participant-count">18</div>
        <div className="participants-block">
          <section className="participants-label">{t`Participants`}</section>
          <section className="participants-icons">{Array(18).join(' ­')}</section>
        </div>
      </section>
    </div>
    <div>
      <div className="places-block">
        <section className="poi-icon"></section>
        <section className="planned-label"><b>{40}</b>{t`Planned`}</section>
        <section className="achieved-label"><b>{96}</b> {t`Achieved`}</section>
      </div>
      <div className="places-graph">
        <section style={{width: '20%'}} className="line-graph-achieved">{20}%</section>
        <section style={{width: '60%'}} className="line-graph-failed">{60}%</section>
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
      background-color: white;
      width: 400px;    
      position: absolute;
      right: 20px;
      bottom: 40px;
      
      .places-block {
        display: flex;
        margin: 10px;
        justify-content: space-around;
        
        b {      
          font-size: 35px;
          display: block;
        }
        
        .poi-icon {
          font-size: 35px;
          font-family: 'iconfield-v03';
          margin-left: 10px;
          margin-right: 50px;
        }
        .planned-label, .achieved-label {
          text-align: center;
          font-weight: 400;
        }
      }
      
      .places-graph {
        margin: 10px;
        
        section {
          width: 30%;
          height: 25px;      
          padding: 5px;
          line-height: 15px;
          display: inline-block;
          text-align: right;
          vertical-align: middle;
          font-weight: 400;
        }
        
        .line-graph-achieved {
          background-color: lightgreen;
          color: white;
        }
        .line-graph-failed {
          background-color: lightcoral;
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
          width: 100%;
        }
        
        section.image-overlay {
          position: absolute;
          color: white;
          bottom: 0px;
          padding: 10px;
          width: 100%;
          
          .participant-count {
            font-size: 48px;
            font-weight: bold;
            text-shadow: 1px 1px 2px black; 
          }
          
          .participants-block {
            display: flex;
            margin-right: 10px;
            
            .participants-label {
              margin-right: 10px;
              text-shadow: 1px 1px 2px black; 
              font-weight: 400;
            }
            .participants-icons {          
              margin-right: 10px;
              font-family: 'iconfield-v03';
              text-shadow: 1px 1px 2px black; 
              font-size: 10px;
              flex-grow: 1;
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
