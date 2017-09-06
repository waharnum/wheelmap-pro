import * as React from 'react';
import styled from 'styled-components';
import * as moment from 'moment';

import MapLayout from '../../layouts/MapLayout';

import { default as PublicHeader, HeaderTitle } from '../../components/PublicHeader';

import Button from '../../components/Button';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import { IStyledComponent } from '../../components/IStyledComponent';
import { AutoSizedStaticMap } from '../../components/StaticMap';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import { reactiveSubscriptionById, IAsyncDataByIdProps } from '../../components/reactiveModelSubscription';
import { IEvent, Events } from '../../../both/api/events/events';

interface IPageModel {
  organization: IOrganization;
  event: IEvent;
};

const ShowEventPage = (props: IAsyncDataByIdProps<IPageModel> & IStyledComponent) => {
  return (
    <MapLayout className={props.className}>
      <PublicHeader
        titleComponent={(
          <HeaderTitle
            title={props.model.organization.name}
            description={props.model.organization.description}
            prefixTitle={props.model.organization.name}
            logo={props.model.organization.logo}
          />
        )}
        organizeLink={`/events/${props.model.event._id}/organize`}
      />
      <div className="content-area">
        <AutoSizedStaticMap />
        <div className="event-box">
          <div className="event-body">
            <h3>{props.model.event.name} ({props.model.event.status})</h3>
            <div>{moment(props.model.event.startTime).format('LLLL')}</div>
            <div>{props.model.event.regionName}</div>
            <div>{moment(props.model.event.startTime).diff(moment(), 'days')} Days Left</div>
            <Button to="">Join Us</Button>
          </div>      
        </div>
      </div>
    </MapLayout>
  );
};

const ReactiveShowEventPage = reactiveSubscriptionById(
  wrapDataComponent<IPageModel,
      IAsyncDataByIdProps<IPageModel | null>,
      IAsyncDataByIdProps<IPageModel>>(ShowEventPage),
  (id) => {
    const event = Events.findOne(id);
    const organization = event ? event.getOrganization() : null;
    // fetch model with organization & events in one go
    // TODO: limit this to the actual ongoing events
    return { organization, event };
  },
  // TODO: this should be public links
  // TODO: this should only fetch the organization by id, not all
  'events.by_id.private', 'organizations.public');

export default styled(ReactiveShowEventPage) `
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
