import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import * as moment from 'moment';

import Button from '../../components/Button';
import Map from '../../components/Map';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {reactiveSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';

import {IEvent} from '../../../both/api/events/events';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import {colors} from '../../stylesheets/colors';
import OrganizationAdminHeader from './OrganizationAdminHeader';
import OrganizationStatistics from './OrganizationStatistics';
import EventStatistics from '../Events/EventStatistics';

interface IPageModel {
  organization: IOrganization;
  events: IEvent[];
};

const EventListEntry = (props: { model: IEvent }) => (
  <div className="event-list-entry">
    <div className="event-body">
      <div className="event-information">
        <div className="event-description">
          <h3>{props.model.name}</h3>
          <h4>{moment(props.model.startTime).format('LLLL')}</h4>
          <p className="event-region">{props.model.regionName}</p>
        </div>
        {
          (props.model.startTime && props.model.startTime > new Date()) ?
            (<div className="time-until-event">
              <p>{moment(props.model.startTime).diff(moment(), 'days')}</p>
              <small>{t`Days Left`}</small>
            </div>) :
            (<div className="time-until-event">
              <p>{moment().diff(moment(props.model.startTime), 'days')}</p>
              <small>{t`Days Ago`}</small>
            </div>)
        }
      </div>
      <EventStatistics className="event-footer"
                       event={props.model}
                       planned={true}
                       achieved={true}
                       action={<Button to={`/events/${props.model._id}/organize`}>{t`Show details`}</Button>}/>
    </div>
    <div className="event-status corner-ribbon">
      {props.model.status}
    </div>
    <Map
      className="event-mini-map"
      enablePlaceDetails={false}
    />
  </div>
);

const EventList = (props: { model: IEvent[] }) => (
  <div>
    {props.model.map((event) => (
      <EventListEntry key={String(event._id)} model={event}/>
    ))}
  </div>
);

const OrganizeOrganizationsPage = (props: IStyledComponent & IAsyncDataByIdProps<IPageModel>) => (
  <ScrollableLayout id="OrganizeOrganizationPage" className={props.className}>
    <OrganizationAdminHeader organization={props.model.organization}/>
    <div className="content-area scrollable">
      <OrganizationStatistics
        action={(
          <section className="new-event">
            <Button to="/events/create" className="btn-primary">{t`Create event`}</Button>
          </section>
        )}
      />
      <EventList model={props.model.events}/>
    </div>
  </ScrollableLayout>
);

const ReactiveOrganizeOrganizationsPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(OrganizeOrganizationsPage),
  (id): IPageModel | null => {
    const organization = Organizations.findOne(id);
    if (!organization) {
      return null;
    }
    const events = organization.getEvents();
    // pass model with organization & events in one go
    return {organization, events};
  },
  'organizations.by_id.private', 'events.by_organizationId.private');

const StyledReactiveOrganizeOrganizationsPage = styled(ReactiveOrganizeOrganizationsPage)`

  .content-area {
    padding-top: 0;
    padding-left: 0; /* to have a marginless stats bar */
    padding-right: 0; /* to have a marginless stats bar */
  }

  

  /* -------------------------- event list styling -----------------------------------*/

  .event-list-entry {
    position: relative;
    height: 240px;
    margin: 20px;
    background: white;
    border: 1px solid #DEDEDE;
    border-radius: 4px;
    display: flex;    
    box-sizing: content-box;

    .event-status {
      font-size: 16px;
      font-weight: 400;
      text-transform: uppercase;
      color: white;
      background-color: ${colors.activeOrange};
      
      &.corner-ribbon {
        position: absolute;
        padding: 2px 20px;
        bottom: 20px;
        right: 0px;
        z-index: 5;
      }
    }

    .event-body {
      padding: 20px;
      padding-bottom: 0;
      flex-basis: 70%;
      border-right: 1px solid rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .event-information {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        
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

    .event-mini-map {
      pointer-events: none;
      touch-action: none;
      
      .leaflet-marker-icon.leaflet-interactive {
        pointer-events: none;
        touch-action: none;
      }
      
      .leaflet-control-container {
        display: none;
      }
      section.leaflet.container {
        width: 180px;
        border-radius: 0 4px 4px 0;
        overflow: overlay;
      }
    }
  }
`;

export default StyledReactiveOrganizeOrganizationsPage;
