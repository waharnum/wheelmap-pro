import { t } from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import * as moment from 'moment';

import Button from '../../components/Button';
import StaticMap from '../../components/StaticMap';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {reactiveSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';

import {IEvent} from '../../../both/api/events/events';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import {colors} from '../../stylesheets/colors';
import OrganizationAdminHeader from './OrganizationAdminHeader';

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
        <div className="time-until-event">
          <p>{moment(props.model.startTime).diff(moment(), 'days')}</p>
          <small>{t`Days Left`}</small>
        </div>
      </div>
      <div className="event-footer">
        <div className="stats event-stats">
          <section className="participant-stats">
            <span className="participants-invited">99<small>{`invited`}</small></span>
            <span className="participants-registered key-figure">98<small>{t`registered`}</small></span>
          </section>
          <section className="location-stats">
            <span className="locations-planned">99<small>{t`planned`}</small></span>
            <span className="locations-mapped key-figure">98<small>{t`mapped`}</small></span>
          </section>
        </div>
        <Button to={`/events/${props.model._id}/organize`}>{t`Show details`}</Button>
      </div>
    </div>
    <div className="event-status corner-ribbon">
      {props.model.status}
    </div>
    <StaticMap className="event-mini-map" containerWidth={180} containerHeight={180}/>
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
      <div className="stats organization-stats">
        <section className="participant-stats">
          <span className="participants-invited">70<small>{t`invited`}</small></span>
          <span className="participants-registered key-figure">69<small>{t`registered`}</small></span>
        </section>
        <section className="location-stats">
          <span className="locations-planned">70<small>{t`planned`}</small></span>
          <span className="locations-mapped key-figure">69<small>{t`mapped`}</small></span>
        </section>
        <section className="event-stats">
          <span className="events-planned key-figure">70<small>{t`created`}</small></span>
          <span className="events-completed">69<small>{t`completed`}</small></span>
        </section>
        <section className="new-event">
          <Button to="/events/create" className="btn-primary">{t`Create event`}</Button>
        </section>
      </div>
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

export default StyledReactiveOrganizeOrganizationsPage;
