import {t} from 'c-3po';
import * as React from 'react';
import styled from 'styled-components';
import {browserHistory} from 'react-router';

import {AutoForm, AutoFields, SubmitField, BoolField, LongTextField, ErrorsField} from 'uniforms-bootstrap3';
import ImageLinkUrlField from '../../components/ImageLinkUrlField';
import {HintBox, Hint} from '../../components/HintBox';
import {IStyledComponent} from '../../components/IStyledComponent';
import {Organizations, IOrganization} from '../../../both/api/organizations/organizations';

export interface IOrganizationBaseFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
  initialModel?: IOrganization;
  mode: 'edit' | 'create';
}

interface IBaseFormState {
  model?: IOrganization;
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
      help: t`Optimal a 640 x 400 PNG-file with transparency.`,
    },
  },
});

export const OrganizationFormHintBox = () => (
  <div className="content-right">
    <HintBox>
      <Hint className="rocket">
        {t`Wheelmap Pro helps you to plan and organize mapping events for accessibility data.`}
      </Hint>
      <Hint className="info">
        {t`This gathered information can then be shared publicly to help people with with and
        without disabilities to navigate the world.`}
      </Hint>
      <Hint className="map">
        {t`The app for your Organization will be setup and you’ll be ready to create your first mapping event.`}
      </Hint>
    </HintBox>
  </div>);

class InternalOrganizationBaseForm
  extends React.Component<IOrganizationBaseFormProps & IStyledComponent, IBaseFormState> {
  public state = {
    model: {} as IOrganization,
  };
  private formRef: AutoForm;

  constructor(props: IOrganizationBaseFormProps & IStyledComponent) {
    super(props);
    this.state.model = this.props.initialModel || {} as IOrganization;
  }

  public render(): JSX.Element {
    return (
      <div className={this.props.className + ' content-left'}>
        <AutoForm
          placeholder={true}
          showInlineError={true}
          model={this.state.model}
          schema={schema}
          onSubmit={this.onSubmit}
          onChangeModel={this.onChangeModel}
          ref={this.storeFormReference}>
          <AutoFields fields={['name', 'description', 'webSite', 'logo', 'tocForOrganizationsAccepted']}/>
          <ErrorsField/>
          <div className="actions">
            {this.props.mode == 'edit' ?
              <SubmitField value={t`Update`}/> :
              <SubmitField value={t`Create`}/>}
            <button className="btn btn-default" onClick={browserHistory.goBack}>{t`Cancel`}</button>
          </div>
        </AutoForm>
      </div>);
  }

  private onChangeModel = (model) => {
    this.setState({model});
  }

  private storeFormReference = (ref: AutoForm) => {
    this.formRef = ref;
  }

  private onSubmit = (doc: IOrganization) => {
    return new Promise((resolve: (id: Mongo.ObjectID) => void, reject: (error: Error) => void) => {
      const id = this.state.model._id;
      if (id != null) {
        const {_id, ...strippedDoc} = doc;
        console.log('Updating doc', strippedDoc, id);
        Organizations.update({_id: id}, {$set: strippedDoc}, {}, (error, count) => {
          console.log('Updated ', _id, count);
          if (!error && _id) {
            resolve(_id);
          } else {
            reject(error);
          }

        });
      } else {
        console.log('Creating doc', doc);
        Meteor.call('organizations.insert', doc, (error, resultId: Mongo.ObjectID) => {
          console.log('Saved as ', resultId, error);
          if (!error) {
            this.setState({model: {_id: resultId} as IOrganization});
            resolve(resultId);
          } else {
            reject(error);
          }
        });
      }
    }).then((resultId: Mongo.ObjectID) => {
      if (this.props.afterSubmit) {
        this.props.afterSubmit(resultId);
      }
    }, (error) => {
      this.formRef.setState({error});
    });
  }
};

export const OrganizationBaseForm = styled(InternalOrganizationBaseForm) `
`;
