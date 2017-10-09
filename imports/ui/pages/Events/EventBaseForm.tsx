import {t} from 'c-3po';
import {AutoSizedStaticMap} from '../../components/StaticMap';
import * as React from 'react';
import styled from 'styled-components';
import {browserHistory} from 'react-router';

import {AutoForm, AutoFields, SubmitField, LongTextField, ErrorsField} from 'uniforms-bootstrap3';

import ImageLinkUrlField from '../../components/ImageLinkUrlField';
import {Events, IEvent} from '../../../both/api/events/events';
import {IStyledComponent} from '../../components/IStyledComponent';

import * as moment from 'moment';

export interface IEventBaseFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
  initialModel?: IEvent;
}

interface IBaseFormState {
  model?: IEvent;
}

const schema = Events.schema;
schema.extend({
  // if not an object this will override the placeholder
  description: {
    uniforms: {
      component: LongTextField,
    },
  },
  // if not an object this will override the placeholder
  photoUrl: {
    uniforms: {
      component: ImageLinkUrlField,
      help: 'Optimal a 640 x 400 PNG-file.',
    },
  },
});

class InternalEventBaseForm extends React.Component<IEventBaseFormProps & IStyledComponent, IBaseFormState> {
  public state = {
    model: {} as IEvent,
  };
  private formRef: AutoForm;

  constructor(props: IEventBaseFormProps & IStyledComponent) {
    super(props);

    this.state.model = this.props.initialModel || {
      organizationId: Meteor.user().profile.activeOrganizationId,
      status: 'draft',
      openFor: 'inviteOnly',
    } as IEvent;

    // convert the input time from utc to local
    this.state.model.startTime = this.props.initialModel ?
      moment(this.props.initialModel.startTime).add(moment().utcOffset(), 'minutes').toDate() :
      moment().add(7, 'days').add(moment().utcOffset(), 'minutes').minutes(0).seconds(0).toDate();
  }

  public render(): JSX.Element {
    return (
      <div className={this.props.className + ' content-area hsplit'}>
        <div className="content-left">
          <AutoForm
            placeholder={true}
            showInlineError={true}
            model={this.state.model}
            schema={schema}
            onSubmit={this.onSubmit}
            onChangeModel={this.onChangeModel}
            ref={this.storeFormReference}>
            <AutoFields fields={['name', 'description', 'regionName', 'startTime',
              'verifyGpsPositionsOfEdits', 'openFor', 'photoUrl']}/>
            <ErrorsField/>
            <div className="actions">
              <SubmitField/>
              <button className="btn btn-default" onClick={browserHistory.goBack}>{t`Cancel`}</button>
            </div>
          </AutoForm>
        </div>
        <div className="content-right">
          <AutoSizedStaticMap/>
        </div>
      </div>);
  }

  private onChangeModel = (model) => {
    this.setState({model});
  }

  private storeFormReference = (ref: AutoForm) => {
    this.formRef = ref;
  }

  private onSubmit = (doc: IEvent) => {
    return new Promise((resolve: (id: Mongo.ObjectID) => void, reject: (error: Error) => void) => {
      const id = this.state.model._id;
      // remove id
      const {_id, ...strippedDoc} = doc;
      // convert local back to utc when saving
      strippedDoc.startTime = moment(strippedDoc.startTime).subtract(moment().utcOffset(), 'minutes').toDate();
      if (id != null) {
        console.log('Updating doc', strippedDoc, id);
        Events.update({_id: id}, {$set: strippedDoc}, (error, count) => {
          console.log('Updated ', _id, count);
          if (!error && _id) {
            resolve(_id);
          } else {
            reject(error);
          }
        });
      } else {
        console.log('Creating doc', strippedDoc);
        Meteor.call('events.insert', strippedDoc, (error, resultId: Mongo.ObjectID) => {
          console.log('Saved as ', resultId, error);
          if (!error) {
            this.setState({model: {_id: resultId} as IEvent});
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

export const EventBaseForm = styled(InternalEventBaseForm) `
  flex-direction: row;
  display: flex;

  .content-left {
    flex-grow: 0;
    padding: 24px;
    overflow-y: auto;
    overflow-x: hidden;
    min-width: 424px;
  }
  .content-right {
    flex-grow: 1;
  }
`;
