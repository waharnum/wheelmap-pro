import styled from 'styled-components';
import * as React from 'react';

import EventTabs from './EventTabs';
import {IOrganization} from '../../../both/api/organizations/organizations';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import { IEvent, Events } from '../../../both/api/events/events';
import { IStyledComponent } from '../../components/IStyledComponent';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import AdminHeader, { HeaderTitle } from '../../components/AdminHeader';
import { reactiveSubscriptionById, IAsyncDataByIdProps } from '../../components/reactiveModelSubscription';

interface IPageModel {
  event: IEvent;
  organization: IOrganization;
}

class EventParticipantsPage extends React.Component<
    IAsyncDataByIdProps<IPageModel> & IStyledComponent> {
  public render(): JSX.Element {
    const event = this.props.model.event;
    const organization = this.props.model.organization;

    return (
      <ScrollableLayout className={this.props.className}>
        <AdminHeader
          titleComponent={(
            // TODO: Move to shared component
            <HeaderTitle
              title={event.name}
              prefixTitle={organization.name as string}
              logo={organization.logo}
              prefixLink={`/organizations/${organization._id}/organize`}
            />
          )}
          tabs={<EventTabs id={event._id || ''}/>}
          publicLink={`/events/${event._id}`}
        />
        <div className="content-area scrollable">
          Event Participants Page
        </div>
      </ScrollableLayout>
    );
  }
}

const ReactiveEventParticipantsPage = reactiveSubscriptionById(
  wrapDataComponent<IPageModel,
      IAsyncDataByIdProps<IPageModel | null>,
      IAsyncDataByIdProps<IPageModel>>(EventParticipantsPage),
  (id) : IPageModel => {
    // TODO: this can be optimized by being smarter about what to query
    const event = Events.findOne(id);
    const organization = event.getOrganization();
    return { event, organization };
  }, 'events.by_id', 'organizations.my.private');

export default styled(ReactiveEventParticipantsPage) `
`;
