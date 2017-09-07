import EventTabs from './EventTabs';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import styled from 'styled-components';
import * as React from 'react';
import { browserHistory } from 'react-router';

import { IStyledComponent } from '../../components/IStyledComponent';
import { IEvent, Events } from '../../../both/api/events/events';
import AdminTab from '../../components/AdminTab';
import EventBaseForm, { IEventBaseFormProps } from './EventBaseForm';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import AdminHeader, { HeaderTitle } from '../../components/AdminHeader';

import { reactiveModelSubscriptionByParams, IAsyncDataByIdProps } from '../../components/reactiveModelSubscription';

interface IEditEventFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

class EditEventForm extends React.Component<
    IAsyncDataByIdProps<IEvent> & IEditEventFormProps & IStyledComponent> {
  public render(): JSX.Element {
    return (
      <ScrollableLayout className={this.props.className}>
        <AdminHeader
          titleComponent={<HeaderTitle title="Edit Event" />}
          tabs={<EventTabs id={this.props.model._id || ''}/>}
        />
        <div className="content-area scrollable">
          <EventBaseForm
            initialModel={this.props.model}
            afterSubmit={this.goToEvent} />
        </div>
      </ScrollableLayout>
    );
  }
  private goToEvent = () => { browserHistory.push(`/events/${this.props.model._id}/organize`); };
}

const EditFormContainer = reactiveModelSubscriptionByParams(
  wrapDataComponent<IEvent, IAsyncDataByIdProps<IEvent | null>, IAsyncDataByIdProps<IEvent>>(EditEventForm),
  Events, 'events.by_id.private');

export default styled(EditFormContainer) `
`;
