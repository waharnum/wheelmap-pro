import * as React from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';

import AutoForm from 'uniforms-bootstrap3/AutoForm';
import AutoFields from 'uniforms-bootstrap3/AutoFields';
import SubmitField from 'uniforms-bootstrap3/SubmitField';
import BoolField from 'uniforms-bootstrap3/BoolField';
import LongTextField from 'uniforms-bootstrap3/LongTextField';

import { Events, IEvent } from '../../../both/api/events/events';
import { IStyledComponent } from '../../components/IStyledComponent';

import * as moment from 'moment';

export interface IEventBaseFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
  initialModel?: IEvent;
}

interface IBaseFormState {
  model?: IEvent;
  isSaving: boolean;
}

const schema = Events.schema;

class EventBaseForm extends React.Component<IEventBaseFormProps & IStyledComponent, IBaseFormState> {
  public state = {
    model: {} as IEvent,
    isSaving: false,
  };

  constructor(props: IEventBaseFormProps & IStyledComponent) {
    super(props);

    this.state.model = this.props.initialModel || {
      organizationId: Meteor.user().profile.activeOrganizationId,
      status: 'draft',
      visibility: 'inviteOnly',
    } as IEvent;

    // convert the input time from utc to local
    this.state.model.startTime = this.props.initialModel ?
        moment(this.props.initialModel.startTime).add(moment().utcOffset(), 'minutes').toDate() :
        moment().add(7, 'days').add(moment().utcOffset(), 'minutes').minutes(0).seconds(0).toDate();
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
        <AutoFields fields={['name', 'description', 'regionName', 'startTime',
            'verifyGpsPositionsOfEdits', 'visibility']} />
        <SubmitField />
        <button className="btn btn-default" onClick={browserHistory.goBack}>Cancel</button>
      </AutoForm>
    </div>);
  }

  private onChangeModel = (model) => {
    this.setState({model});
  }

  private onSubmit = (doc: IEvent) => {
    this.setState({isSaving: true});

    const id = this.state.model._id;

    // remove id
    const {_id, ...strippedDoc} = doc;

    // convert local back to utc when saving
    strippedDoc.startTime = moment(strippedDoc.startTime).subtract(moment().utcOffset(), 'minutes').toDate();

    if (id != null) {
      console.log('Updating doc', strippedDoc, id);
      Events.update({_id: id}, {$set: strippedDoc}, (count) => {
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
      console.log('Creating doc', strippedDoc);
      Meteor.call('events.insert', strippedDoc, (error, resultId: Mongo.ObjectID) => {
        // TODO: handle errors
        console.log('Saved as ', resultId, error);
        if (!error) {
          this.setState({model: {_id: resultId} as IEvent, isSaving: false});
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

export default styled(EventBaseForm) `
`;
