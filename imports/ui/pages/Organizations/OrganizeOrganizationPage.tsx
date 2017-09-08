import styled from 'styled-components';
import * as React from 'react';
import * as moment from 'moment';

import Button from '../../components/Button';
import AdminTab from '../../components/AdminTab';
import StaticMap from '../../components/StaticMap';
import AdminHeader from '../../components/AdminHeader';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import OrganizationTabs from './OrganizationTabs';
import { IStyledComponent } from '../../components/IStyledComponent';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import OrganizationsDropdown from '../../components/OrganizationsDropdown';
import {reactiveSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';

import { IEvent } from '../../../both/api/events/events';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import { colors } from '../../stylesheets/colors';

interface IPageModel { organization: IOrganization; events: IEvent[]; };

const EventListEntry = (props: {model: IEvent}) => (
  <div className="event-list-entry">
    <div className="event-body">
      <div className="event-information">
        <div className="event-description">
          <h3>{props.model.name}</h3>
          <h4>{moment(props.model.startTime).format('LLLL')}</h4>
          <p className="event-region">{props.model.regionName}</p>
        </div>
        <div className="time-until-event">
          <p>{moment(props.model.startTime).diff(moment(), 'days')}</p>
          <small>Days Left</small>
        </div>
      </div>
      <div className="event-footer">
        <div className="stats event-stats">
          <section className="participant-stats">
            <span className="participants-invited">0<small>invited</small></span>
            <span className="participants-registered key-figure">1<small>registered</small></span>
          </section>
          <section className="location-stats">
            <span className="locations-planned">0<small>planned</small></span>
            <span className="locations-mapped key-figure">0<small>mapped</small></span>
          </section>
        </div>
        <Button to={`/events/${props.model._id}/organize`}>Show details</Button>
      </div>
    </div> 
    <div className="event-status corner-ribbon">
        {props.model.status}
      </div>
    <StaticMap className="event-mini-map" containerWidth={180}  containerHeight={180} />
  </div>
);

const EventList = (props: {model: IEvent[]}) => (
  <div>
    {props.model.map((event) => (
      <EventListEntry key={event._id as React.Key} model={event} />
    ))}
  </div>
);

const OrganizeOrganisationsPage = (props: IStyledComponent & IAsyncDataByIdProps<IPageModel> ) => (
  <ScrollableLayout className={props.className}>
    <AdminHeader
        titleComponent={(
          <OrganizationsDropdown current={props.model.organization} >
            <Button to="/organizations/create" className="btn-primary" >Create Organization</Button>
          </OrganizationsDropdown>
        )}
        tabs={<OrganizationTabs id={props.model.organization._id || ''}/>}
        publicLink={`/organizations/${props.model.organization._id}`}
    />
    <div className="content-area scrollable">
      <div className="stats organization-stats">
        <section className="participant-stats">
          <span className="participants-invited">0<small>invited</small></span>
          <span className="participants-registered key-figure">1<small>registered</small></span>
        </section>
        <section className="location-stats">
          <span className="locations-planned">0<small>planned</small></span>
          <span className="locations-mapped key-figure">0<small>mapped</small></span>
        </section>
        <section className="event-stats">
          <span className="events-planned key-figure">1<small>created</small></span>
          <span className="events-completed">0<small>completed</small></span>
        </section>
        <section className="new-event">
          <Button to="/events/create" className="btn-primary">Create event</Button>
        </section>
      </div>
      <EventList model={props.model.events} />
    </div>
  </ScrollableLayout>
);

const ReactiveOrganizeOrganisationsPage = reactiveSubscriptionByParams(
    wrapDataComponent<IPageModel,
        IAsyncDataByIdProps<IPageModel | null>,
        IAsyncDataByIdProps<IPageModel>>(OrganizeOrganisationsPage),
    (id): IPageModel | null => {
      const organization = Organizations.findOne(id);
      const events = organization ? organization.getEvents() : [];
      // pass model with organization & events in one go
      return organization ? { organization, events } : null;
    },
    'organizations.by_id.public', 'events.by_organizationId.private');

const StyledReactiveOrganizeOrganisationsPage = styled(ReactiveOrganizeOrganisationsPage)`

  .content-area {
    padding-top: 0;
    padding-left: 0; /* to have a marginless stats bar */
    padding-right: 0; /* to have a marginless stats bar */
  }

  .stats {
    padding-top: 20px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    
    &.organization-stats {
      border-bottom: 1px solid ${colors.shadowGrey};
    }

    section {
      padding: 0px 20px 0 20px;
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
          font-weight: 800;
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

    section.new-event {
      padding-bottom: 20px;
    }
  }

  /* -------------------------- event list styling -----------------------------------*/

  .event-list-entry {
    position: relative;
    height: 180px;
    width: 100%;
    max-width: 90vw;
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
      flex-grow: 1;
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
      border-radius: 0 4px 4px 0;
      overflow: overlay;
    }
  }

`;

export default StyledReactiveOrganizeOrganisationsPage;
