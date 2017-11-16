import EventTabs from './EventTabs';
import styled from 'styled-components';
import * as React from 'react';
import {browserHistory} from 'react-router';

import MapLayout from '../../layouts/MapLayout';
import {IEvent, Events} from '../../../both/api/events/events';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import AdminHeader, {HeaderTitle} from '../../components/AdminHeader';
import {EventBaseForm} from './EventBaseForm';
import {
  reactiveModelSubscriptionByParams, IAsyncDataByIdProps,
  reactiveSubscriptionByParams,
} from '../../components/reactiveModelSubscription';
import {IOrganization} from '../../../both/api/organizations/organizations';

interface IEditEventFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

interface IPageModel {
  event: IEvent;
  organization: IOrganization;
}

class EditEventPage extends React.Component<IAsyncDataByIdProps<IPageModel> & IEditEventFormProps & IStyledComponent> {
  public render(): JSX.Element {
    return (
      <MapLayout className={this.props.className}>
        <AdminHeader
          titleComponent={<HeaderTitle title={this.props.model.event.name}
                                       prefixTitle={this.props.model.organization.name}
                                       logo={this.props.model.organization.logo}
                                       prefixLink={`/organizations/${this.props.model.organization._id}/organize`}/>}
          tabs={<EventTabs id={this.props.model.event._id}/>}
        />
        <EventBaseForm
          initialModel={this.props.model.event}
          afterSubmit={this.goToEvent}
          mode="edit"/>
      </MapLayout>
    );
  }

  private goToEvent = () => {
    browserHistory.push(`/events/${this.props.model.event._id}/organize`);
  };
}

const EditEventPageContainer = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(EditEventPage),
  (id): IPageModel | null => {
    const event = Events.findOne(id);
    const organization = event ? event.getOrganization() : null;
    return event && organization ? {event, organization} : null;
  },
  'events.by_id.private', 'organizations.by_eventId.private');


export default styled(EditEventPageContainer) `
`;
