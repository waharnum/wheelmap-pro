import { wrapDataComponent } from '../../components/AsyncDataComponent';
import styled from 'styled-components';
import * as React from 'react';
import { browserHistory } from 'react-router';

import { IStyledComponent } from '../../components/IStyledComponent';
import { IEvent, Events } from '../../../both/api/events/events';
import AdminTab from '../../components/AdminTab';
import EventBaseForm, { IEventBaseFormProps } from './EventBaseForm';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import AdminHeader from '../../components/AdminHeader';

import { reactiveModelSubscriptionById, IModelProps } from '../../components/reactiveModelSubscription';

interface IEditEventFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

class EditEventForm extends React.Component<
    IModelProps<IEvent> & IEditEventFormProps & IStyledComponent> {
  public render(): JSX.Element {
    return (
      <ScrollableLayout className={this.props.className}>
        <AdminHeader
          titleComponent={<h1>Edit Event</h1>}
          tabs={(
            <div>
              <AdminTab to={`/events/${this.props.model._id}/organize`} title="Dashboard" />
              <AdminTab to={`/events/statistics/${this.props.model._id}`} title="Statistics" />
              <AdminTab to="" title="Customize" active={true} />
              <AdminTab to={`/events/${this.props.model._id}/members`} title="Members" />
            </div>
          )}
        />
        <div className="content-area scrollable">
          <EventBaseForm
            initialModel={this.props.model}
            afterSubmit={() => { browserHistory.push('/'); }} />
        </div>
      </ScrollableLayout>
    );
  }
}

const EditFormContainer = reactiveModelSubscriptionById(
  wrapDataComponent<IEvent, IModelProps<IEvent | null>, IModelProps<IEvent>>(EditEventForm),
  Events, 'events.by_id');

export default styled(EditFormContainer) `
`;
