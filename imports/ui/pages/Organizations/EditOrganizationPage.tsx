import styled from 'styled-components';
import * as React from 'react';
import { browserHistory } from 'react-router';

import { IStyledComponent } from '../../components/IStyledComponent';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import OrganizationBaseForm, { IBaseFormProps } from './OrganizationBaseForm';
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
      <OrganizationBaseForm
        initialModel={this.props.model}
        afterSubmit={() => { browserHistory.push('/dashboard'); }} />
    );
  }
}

const EditFormContainer = reactiveModelSubscriptionById(EditOrganizationForm, Organizations, 'organizations.by_id');

export default styled<IBaseFormProps>(EditFormContainer) `
`;
