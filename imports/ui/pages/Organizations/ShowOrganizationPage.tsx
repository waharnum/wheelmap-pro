import styled from 'styled-components';
import * as React from 'react';
import * as moment from 'moment';

import MapLayout from '../../layouts/MapLayout';

import { default as PublicHeader, HeaderTitle } from '../../components/PublicHeader';

import Button from '../../components/Button';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import { IStyledComponent } from '../../components/IStyledComponent';
import { AutoSizedStaticMap } from '../../components/StaticMap';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import { reactiveSubscriptionByParams, IAsyncDataByIdProps } from '../../components/reactiveModelSubscription';
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
        <AutoSizedStaticMap />
        {event ? (
        <div className="event-box">
          <div className="event-body">
            <h3>{event.name} ({event.status})</h3>
            <div>{moment(event.startTime).format('LLLL')}</div>
            <div>{event.regionName}</div>
            <div>{moment(event.startTime).diff(moment(), 'days')} Days Left</div>
            <Button to={`/events/${event._id}`}>Join Us</Button>
          </div>
        </div>
        ) : null}
      </div>
    </MapLayout>
  );
};

const ReactiveShowOrganisationPage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
      IAsyncDataByIdProps<IPageModel | null>,
      IAsyncDataByIdProps<IPageModel>>(ShowOrganizationPage),
  (id) => {
    const organization = Organizations.findOne(id);
    // fetch model with organization & events in one go
    // TODO: limit this to the actual ongoing events
    return organization ? {organization, event: organization.getEvents()[0]} : null;
  },
  'organizations.by_id.public', 'events.by_organizationId.private');

export default styled(ReactiveShowOrganisationPage) `
  .content-area {
    justify-content: center;
    align-content: center;
    display: flex;
  }

  .event-box {
    margin: auto;
    position: relative;
    background: white;
    padding: 20px 30px;
    box-shadow: 0 0 7px 1px rgba(0,0,0,0.4);
  }
`;
