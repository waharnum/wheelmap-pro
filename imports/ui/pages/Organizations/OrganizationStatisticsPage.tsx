import styled from 'styled-components';
import * as React from 'react';

import AdminTab from '../../components/AdminTab';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import OrganizationTabs from './OrganizationTabs';
import { IStyledComponent } from '../../components/IStyledComponent';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import AdminHeader, { HeaderTitle } from '../../components/AdminHeader';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';

import { reactiveModelSubscriptionByParams, IAsyncDataByIdProps } from '../../components/reactiveModelSubscription';

class OrganizationStatisticsPage extends React.Component<
    IAsyncDataByIdProps<IOrganization> &  IStyledComponent> {
  public render(): JSX.Element {
    return (
      <ScrollableLayout className={this.props.className}>
        <AdminHeader
          titleComponent={<HeaderTitle title="Statistics" />}
          tabs={<OrganizationTabs id={this.props.model._id || ''}/>}
        />
        <div className="content-area scrollable hsplit" />
      </ScrollableLayout>
    );
  }
}

const ReactiveOrganizationStatisticsPage = reactiveModelSubscriptionByParams(
  wrapDataComponent<
      IOrganization,
      IAsyncDataByIdProps<IOrganization | null>,
      IAsyncDataByIdProps<IOrganization>>(OrganizationStatisticsPage),
  Organizations, 'organizations.by_id.public');

export default styled(ReactiveOrganizationStatisticsPage) `
`;
