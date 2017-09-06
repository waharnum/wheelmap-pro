import * as React from 'react';
import styled from 'styled-components';
import * as moment from 'moment';

import MapLayout from '../../layouts/MapLayout';

import { default as PublicHeader, HeaderTitle } from '../../components/PublicHeader';

import Button from '../../components/Button';
import { Countdown } from '../../components/Countdown';
import { IEvent, Events } from '../../../both/api/events/events';
import { IStyledComponent } from '../../components/IStyledComponent';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import { AutoSizedStaticMap } from '../../components/StaticMap';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import { reactiveSubscriptionById, IAsyncDataByIdProps } from '../../components/reactiveModelSubscription';

interface IPageModel {
  organization: IOrganization;
  event: IEvent;
};

const ShowEventPage = (props: IAsyncDataByIdProps<IPageModel> & IStyledComponent) => {
  const event = props.model.event;
  const organization = props.model.organization;

  return (
    <MapLayout className={props.className}>
      <PublicHeader
        titleComponent={(
          <HeaderTitle
            title={event.name}
            description={event.description}
            prefixTitle={organization.name}
            logo={organization.logo}
            prefixLink={`/organizations/${organization._id}`}
          />
        )}
        organizeLink={`/events/${event._id}/organize`}
      />
      <div>
      <div className="event-date">{moment(event.startTime).format('LLLL')}</div>
      </div>
      <div>
        <Countdown start={moment(event.startTime)} />
      </div>
      <div className="content-area">
        <AutoSizedStaticMap />
        <Button className="join-button btn-primary" to="">Join Us</Button>
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

  .join-button {
    margin: auto;    
    position: relative;
    box-shadow: 0 0 7px 1px rgba(0,0,0,0.4);
  }
`;
