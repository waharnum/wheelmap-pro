import * as React from 'react';
import styled from 'styled-components';

import AutoForm from 'uniforms-bootstrap3/AutoForm';
import AutoFields from 'uniforms-bootstrap3/AutoFields';
import SubmitField from 'uniforms-bootstrap3/SubmitField';
import BoolField from 'uniforms-bootstrap3/BoolField';
import LongTextField from 'uniforms-bootstrap3/LongTextField';

import { Organizations, IOrganization } from '../../../both/api/organizations/organizations';
import { IStyledComponent } from '../../components/IStyledComponent';

export interface IBaseFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
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

class OrganizationBaseForm extends React.Component<IBaseFormProps & IStyledComponent, IBaseFormState> {
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
      <AutoForm
        model={this.state.model}
        disabled={this.state.isSaving}
        schema={schema}
        placeholder={true}
        onSubmit={this.onSubmit}
        showInlineError={true}
        onChangeModel={this.onChangeModel}>
        <AutoFields fields={['name', 'description', 'webSite', 'logo', 'tocForOrganizationsAccepted']} />
        <SubmitField />
      </AutoForm>
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
      Meteor.call('organizations.insert', doc, (error, resultId: Mongo.ObjectID) => {
        // TODO handle errors
        console.log('Saved as ', resultId, error);
        if (!error) {
          this.setState({model: {_id: resultId} as IOrganization, isSaving: false});
          if (this.props.afterSubmit) {
            this.props.afterSubmit(resultId);
          }
        } else {
          this.setState({isSaving: false});
        }
      });
    }
  }
};

export default styled(OrganizationBaseForm) `
`;
