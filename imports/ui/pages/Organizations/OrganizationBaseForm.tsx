import * as React from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';

import AutoForm from 'uniforms-bootstrap3/AutoForm';
import AutoFields from 'uniforms-bootstrap3/AutoFields';
import SubmitField from 'uniforms-bootstrap3/SubmitField';
import BoolField from 'uniforms-bootstrap3/BoolField';
import LongTextField from 'uniforms-bootstrap3/LongTextField';

import ImageLinkUrlField from '../../components/ImageLinkUrlField';
import { IStyledComponent } from '../../components/IStyledComponent';
import { Organizations, IOrganization } from '../../../both/api/organizations/organizations';

export interface IOrganizationBaseFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
  initialModel?: IOrganization;
}

interface IBaseFormState {
  model?: IOrganization;
  isSaving: boolean;
}

const schema = Organizations.schema;
schema.extend({
  tocForOrganizationsAccepted: {
    uniforms: BoolField,
  },
  // if not an object this will override the placeholder
  description: {
    uniforms: {
      component: LongTextField,
    },
  },
  // if not an object this will override the placeholder
  logo: {
    uniforms: {
      component: ImageLinkUrlField,
      help: 'Optimal a 640 x 400 PNG-file with transparency.',
    },
  },
});

class OrganizationBaseForm extends React.Component<IOrganizationBaseFormProps & IStyledComponent, IBaseFormState> {
  public state = {
    model: {} as IOrganization,
    isSaving: false,
  };

  constructor(props: IOrganizationBaseFormProps & IStyledComponent) {
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
        <button className="btn btn-default" onClick={browserHistory.goBack}>Cancel</button>
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
        // TODO: handle errors
        console.log('Updated ', _id, count);
        this.setState({isSaving: false});
        if (count !== false && _id) {
          if (this.props.afterSubmit) {
            this.props.afterSubmit(_id);
          }
        }

      });
    } else {
      console.log('Creating doc', doc);
      Meteor.call('organizations.insert', doc, (error, resultId: Mongo.ObjectID) => {
        // TODO: handle errors
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
