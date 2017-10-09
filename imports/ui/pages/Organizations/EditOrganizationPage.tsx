import styled from 'styled-components';
import * as React from 'react';
import {browserHistory} from 'react-router';

import ScrollableLayout from '../../layouts/ScrollableLayout';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import {OrganizationBaseForm, OrganizationFormHintBox} from './OrganizationBaseForm';
import OrganizationAdminHeader from './OrganizationAdminHeader';

import {reactiveModelSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';

interface IEditOrganizationFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

class EditOrganizationForm extends React.Component<IAsyncDataByIdProps<IOrganization> &
  IEditOrganizationFormProps & IStyledComponent> {
  public render(): JSX.Element {
    return (
      <ScrollableLayout className={this.props.className}>
        <OrganizationAdminHeader organization={this.props.model}/>
        <div className="content-area scrollable hsplit">
          <OrganizationBaseForm
            initialModel={this.props.model}
            afterSubmit={this.goToDashboard}
            mode="edit"/>
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
  Organizations, 'organizations.by_id.private');

export default styled(EditFormContainer) `
`;
