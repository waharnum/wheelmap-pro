import * as React from 'react';
import styled from 'styled-components';
import { createContainer } from 'meteor/react-meteor-data';
import { Organizations, IOrganization } from '../../../both/api/organizations/organizations';

import AutoForm from 'uniforms-bootstrap3/AutoForm';
import BoolField from 'uniforms-bootstrap3/BoolField';
import LongTextField from 'uniforms-bootstrap3/LongTextField';

import { Redirect, RoutePattern, Route } from 'react-router';

// this interface is shared by all components using styled(), align this with the actual ts def later
interface IStyledComponentProps {
  className?: string;
}

interface IDataBindingProps {
  currentUser: Meteor.User;
}

interface ICreateProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
}

interface ICreateState {
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

class Create extends React.Component<ICreateProps & IDataBindingProps & IStyledComponentProps, ICreateState> {
  public state = {
    model: {} as IOrganization,
    isSaving: false,
  };

  public render(): JSX.Element {
    return (
    <div className={this.props.className || ''} >
      <h1>Setup a new community</h1>

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

  private onSubmit = (doc) => {
    this.setState({isSaving: true});

    const id = this.state.model._id;
    if (id != null) {
      console.log('Updating doc', doc, id);
      Organizations.update(id, doc, (error, _id: Mongo.ObjectID) => {
        console.log('Saved as ' + _id);
        this.setState({model: {_id} as IOrganization, isSaving: false});
        if (this.props.afterSubmit) {
          this.props.afterSubmit(_id);
          this.props.afterSubmit(_id);
        }
      });
    } else {
      console.log('Creating doc', doc);
      Organizations.insert(doc, (error, _id: Mongo.ObjectID) => {
        console.log('Saved as ' + _id);
        this.setState({model: {_id} as IOrganization});
        this.setState({model: {_id} as IOrganization, isSaving: false});
        this.props.afterSubmit(_id);
      });
    }
  }
};

const CreateContainer = createContainer((props: ICreateProps & IStyledComponentProps) => {
  const handle = Meteor.subscribe('Organizations');
  return {
    currentUser: Meteor.user(),
  };
}, Create);

export default styled(CreateContainer) `
    color:#444;
`;
