import styled from 'styled-components';
import * as React from 'react';
import {browserHistory} from 'react-router';

import AdminTab from '../../components/AdminTab';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import OrganizationTabs from './OrganizationTabs';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import AdminHeader, {HeaderTitle} from '../../components/AdminHeader';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import {IOrganizationBaseFormProps, OrganizationBaseForm, OrganizationFormHintBox} from './OrganizationBaseForm';

import {reactiveModelSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';

interface IEditOrganizationFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

class EditOrganizationForm extends React.Component<IAsyncDataByIdProps<IOrganization> & IEditOrganizationFormProps & IStyledComponent> {
  public render(): JSX.Element {
    return (
      <ScrollableLayout className={this.props.className}>
        <AdminHeader
          titleComponent={<HeaderTitle title="Edit Organization"/>}
          tabs={<OrganizationTabs id={this.props.model._id || ''}/>}
        />
        <div className="content-area scrollable hsplit">
          <OrganizationBaseForm
            initialModel={this.props.model}
            afterSubmit={this.goToDashboard}/>
          <OrganizationFormHintBox/>
        </div>

      </ScrollableLayout>
    );
  }

  private goToDashboard = () => browserHistory.push(`/organizations/${this.props.model._id}/organize`);
}

const EditFormContainer = reactiveModelSubscriptionByParams(
  wrapDataComponent<IOrganization,
    IAsyncDataByIdProps<IOrganization | null>,
    IAsyncDataByIdProps<IOrganization>>(EditOrganizationForm),
  Organizations, 'organizations.by_id.private'); // FIXME: publish PUBLIC

export default styled(EditFormContainer) `
`;
