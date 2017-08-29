import * as React from 'react';
import styled from 'styled-components';

import BaseForm, { IBaseFormProps } from './BaseForm';
import { reactiveModelSubscriptionById, IModelProps } from './reactiveModelSubscription';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import { IStyledComponent } from '../../IStyledComponent';

class EditForm extends React.Component<IModelProps<IOrganization> & IBaseFormProps & IStyledComponent> {
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
      <BaseForm title="Edit community" initialModel={this.props.model} {...this.props} />
    );
  }
}

const EditFormContainer = reactiveModelSubscriptionById(EditForm, Organizations, 'organizations.by_id');

export default styled<IBaseFormProps>(EditFormContainer) `
`;
