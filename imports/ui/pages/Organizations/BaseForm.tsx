import * as React from 'react';
import styled from 'styled-components';

import AutoForm from 'uniforms-bootstrap3/AutoForm';
import BoolField from 'uniforms-bootstrap3/BoolField';
import LongTextField from 'uniforms-bootstrap3/LongTextField';

import { Organizations, IOrganization } from '../../../both/api/organizations/organizations';
import { IStyledComponent } from '../../IStyledComponent';

export interface IBaseFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
  title?: string;
  initialModel?: IOrganization;
}

interface IBaseFormState {
  model?: IOrganization;
  isSaving: boolean;
}

const schema = Organizations.schema;
schema.extend({
  // override field for tocForOrganizationsAccepted
  tocForOrganizationsAccepted: {
    uniforms: BoolField,
  },
  // this overrides, thus we have to re-add the placeholder
  description: {
    uniforms: {
      component: LongTextField,
      placeholder: 'e.g. Our organization is…',
    },
  },
});

class BaseForm extends React.Component<IBaseFormProps & IStyledComponent, IBaseFormState> {
  public state = {
    model: {} as IOrganization,
    isSaving: false,
  };

  constructor(props: IBaseFormProps & IStyledComponent) {
    super(props);
    this.state.model = this.props.initialModel || {} as IOrganization;
  }

  public render(): JSX.Element {
    return (
    <div className={this.props.className || ''} >
      <h1>{this.props.title}</h1>

      <AutoForm
        model={this.state.model}
        disabled={this.state.isSaving}
        schema={schema}
        placeholder={true}
        onSubmit={this.onSubmit}
        onChangeModel={this.onChangeModel}
        />
    </div>);
  }

  private onChangeModel = (model) => {
    this.setState({model});
  }

  private onSubmit = (doc : IOrganization) => {
    this.setState({isSaving: true});

    const id = this.state.model._id;
    if (id != null) {
      const {_id, ...strippedDoc} = doc;
      console.log('Updating doc', strippedDoc, id);
      Organizations.update({_id: id}, {$set: strippedDoc}, (count) => {
        // TODO handle errors
        console.log('Updated ', _id, count);
        if (count !== false) {
          if (this.props.afterSubmit) {
            this.props.afterSubmit(_id);
          }
        }
        this.setState({isSaving: false});

      });
    } else {
      console.log('Creating doc', doc);
      Organizations.insert(doc, (error, _id: Mongo.ObjectID) => {
        // TODO handle errors
        console.log('Saved as ', _id, error);
        if (!error) {
          this.setState({model: {_id} as IOrganization, isSaving: false});
          if (this.props.afterSubmit) {
            this.props.afterSubmit(_id);
          }
        } else {
          this.setState({isSaving: false});
        }
      });
    }
  }
};

export default styled(BaseForm) `
`;
