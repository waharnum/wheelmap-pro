import styled from 'styled-components';
import * as React from 'react';

import EventTabs from './EventTabs';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import {IEvent, Events} from '../../../both/api/events/events';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import AdminHeader, {HeaderTitle} from '../../components/AdminHeader';

import {reactiveModelSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';

class EventStatisticsPage extends React.Component<IAsyncDataByIdProps<IEvent> & IStyledComponent> {
  public render(): JSX.Element {
    return (
      <ScrollableLayout className={this.props.className}>
        <AdminHeader
          titleComponent={<HeaderTitle title="Statistics"/>}
          tabs={<EventTabs id={this.props.model._id}/>}
        />
        <div className="content-area scrollable hsplit"/>
      </ScrollableLayout>
    );
  }
}

const ReactiveEventStatisticsPage = reactiveModelSubscriptionByParams(
  wrapDataComponent<IEvent,
    IAsyncDataByIdProps<IEvent | null>,
    IAsyncDataByIdProps<IEvent>>(EventStatisticsPage),
  Events, 'events.by_id.private');

export default styled(ReactiveEventStatisticsPage) `
`;
