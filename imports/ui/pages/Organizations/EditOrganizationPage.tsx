import { wrapDataComponent } from '../../components/AsyncDataComponent';
import styled from 'styled-components';
import * as React from 'react';
import { browserHistory } from 'react-router';

import { IStyledComponent } from '../../components/IStyledComponent';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import AdminTab from '../../components/AdminTab';
import OrganizationBaseForm, { IOrganizationBaseFormProps } from './OrganizationBaseForm';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import AdminHeader from '../../components/AdminHeader';

import { reactiveModelSubscriptionById, IModelProps } from '../../components/reactiveModelSubscription';

interface IEditOrganizationFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

class EditOrganizationForm extends React.Component<
  IModelProps<IOrganization> & IEditOrganizationFormProps & IStyledComponent> {
  public render(): JSX.Element {
    if (!this.props.ready) {
      return (
        <div className={this.props.className || ''}>Loading…</div>
      );
    }

    if (this.props.model == null) {
      return (
        <div className={this.props.className || ''}>Object with id:{this.props.params._id} was not found!</div>
      );
    }

    return (
      <ScrollableLayout className={this.props.className}>
        <AdminHeader
          titleComponent={<h1>Edit Organization</h1>}
          tabs={(
            <div>
              <AdminTab to={`/organizations/${this.props.model._id}/organize`} title="Dashboard" />
              <AdminTab to={`/organizations/statistics/${this.props.model._id}`} title="Statistics" />
              <AdminTab to="" title="Customize" active={true} />
              <AdminTab to={`/organizations/${this.props.model._id}/members`} title="Members" />
            </div>
          )}
        />
        <div className="content-area scrollable">
          <OrganizationBaseForm
            initialModel={this.props.model}
            afterSubmit={() => { browserHistory.push('/'); }} />
        </div>
      </ScrollableLayout>
    );
  }
}

const EditFormContainer = reactiveModelSubscriptionById(
  wrapDataComponent<IOrganization, IModelProps<IOrganization | null>, IModelProps<IOrganization>>(EditOrganizationForm),
  Organizations, 'organizations.by_id');

export default styled(EditFormContainer) `
`;
