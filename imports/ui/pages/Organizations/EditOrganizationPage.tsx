import * as React from 'react';
import styled from 'styled-components';

import OrganizationBaseForm, { IBaseFormProps } from './OrganizationBaseForm';
import { reactiveModelSubscriptionById, IModelProps } from '../../components/reactiveModelSubscription';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import { IStyledComponent } from '../../components/IStyledComponent';

class EditOrganizationForm extends React.Component<IModelProps<IOrganization> & IBaseFormProps & IStyledComponent> {
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
      <OrganizationBaseForm title="Edit community" initialModel={this.props.model} {...this.props} />
    );
  }
}

const EditFormContainer = reactiveModelSubscriptionById(EditOrganizationForm, Organizations, 'organizations.by_id');

export default styled<IBaseFormProps>(EditFormContainer) `
`;
