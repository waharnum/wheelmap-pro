import styled from 'styled-components';
import * as React from 'react';

import ScrollableLayout from '../../layouts/ScrollableLayout';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';

import {reactiveModelSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';
import OrganizationAdminHeader from './OrganizationAdminHeader';

class OrganizationStatisticsPage extends React.Component<IAsyncDataByIdProps<IOrganization> & IStyledComponent> {
  public render(): JSX.Element {
    return (
      <ScrollableLayout className={this.props.className}>
        <OrganizationAdminHeader organization={this.props.model}/>
        <div className="content-area scrollable hsplit"/>
      </ScrollableLayout>
    );
  }
}

const ReactiveOrganizationStatisticsPage = reactiveModelSubscriptionByParams(
  wrapDataComponent<IOrganization,
    IAsyncDataByIdProps<IOrganization | null>,
    IAsyncDataByIdProps<IOrganization>>(OrganizationStatisticsPage),
  Organizations, 'organizations.by_id.private');

export default styled(ReactiveOrganizationStatisticsPage) `
`;
