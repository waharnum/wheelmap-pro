import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import * as moment from 'moment';

import MapLayout from '../../layouts/MapLayout';

import {default as PublicHeader, HeaderTitle} from '../../components/PublicHeader';

import Button from '../../components/Button';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {IStyledComponent} from '../../components/IStyledComponent';
import Map from '../../components/Map';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import {reactiveSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';
import {IEvent} from '../../../both/api/events/events';

interface IPageModel {
  organization: IOrganization;
  event: IEvent;
};

const ShowOrganizationPage = (props: IAsyncDataByIdProps<IPageModel> & IStyledComponent) => {
  const organization = props.model.organization;
  const event = props.model.event;

  return (
    <MapLayout className={props.className}>
      <PublicHeader
        titleComponent={(
          <HeaderTitle
            title={organization.name}
            logo={organization.logo}
            description={organization.description}
          />
        )}
        organizeLink={`/organizations/${organization._id}/organize`}
      />
      <div className="content-area">
        <Map/>
        {event ? (
          <div className="map-overlay">
            <div className="event-box">
              <div className="event-body">
                <h3>{event.name} ({event.status})</h3>
                <div>{moment(event.startTime).format('LLLL')}</div>
                <div>{event.regionName}</div>
                <div>{moment(event.startTime).diff(moment(), 'days')} {t`Days Left`}</div>
                <Button to={`/events/${event._id}`}>{t`Join Us`}</Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </MapLayout>
  );
};

const ReactiveShowOrganizationPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(ShowOrganizationPage),
  (id): IPageModel | null => {
    const organization = Organizations.findOne(id);
    // fetch model with organization & events in one go
    return organization ? {organization, event: organization.getEvents()[0]} : null;
  },
  'organizations.by_id.public', 'events.by_organizationId.public');

export default styled(ReactiveShowOrganizationPage) `
  .map {
    justify-content: center;
    align-content: center;
    display: flex;
  }
  
  .map-overlay {
    display: flex;
    justify-content: center;
    align-content: center;
  
    .event-box {
      margin: auto;
      background: white;
      padding: 20px 30px;
      box-shadow: 0 0 7px 1px rgba(0,0,0,0.4);
    }
  }`;
