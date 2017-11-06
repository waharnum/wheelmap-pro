import Map from '../../components/Map';
import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import * as moment from 'moment';
import * as leaflet from 'leaflet';
import {browserHistory} from 'react-router';
import {AutoForm, AutoFields, SubmitField, LongTextField, ErrorsField} from 'uniforms-bootstrap3';

import MapLocationField from '../../components/MapLocationField';
import {Events, IEvent} from '../../../both/api/events/events';
import ImageLinkUrlField from '../../components/ImageLinkUrlField';
import {IStyledComponent} from '../../components/IStyledComponent';


export interface IEventBaseFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
  initialModel?: IEvent;
  mode: 'edit' | 'create';
}

type Partial<T> = {
  [P in keyof T]?: T[P];
  };

interface IBaseFormState {
  model?: Partial<IEvent>;
}

const schema = Events.schema;
schema.extend({
  // if not an object this will override the placeholder
  description: {
    uniforms: {
      component: LongTextField,
    },
  },
  region: {
    uniforms: {
      component: MapLocationField,
    },
  },
  // if not an object this will override the placeholder
  photoUrl: {
    uniforms: {
      component: ImageLinkUrlField,
      help: t`Optimal a 640 x 400 PNG-file.`,
    },
  },
});


class InternalEventBaseForm extends React.Component<IEventBaseFormProps & IStyledComponent, IBaseFormState> {
  public state = {
    model: {} as Partial<IEvent>,
  };
  private formRef: AutoForm;

  constructor(props: IEventBaseFormProps & IStyledComponent) {
    super(props);

    // extract data from document class
    const initialModel = Object.assign({
      organizationId: Meteor.user().profile.activeOrganizationId,
      status: 'draft',
      openFor: 'inviteOnly',
      region: {
        topLeft: {latitude: 52.67551, longitude: 13.08835},
        bottomRight: {latitude: 52.33826, longitude: 13.76116},
      },
    }, this.props.initialModel || {}) as Partial<IEvent>;
    this.state = {model: initialModel};

    // convert the input time from utc to local
    this.state.model.startTime = this.props.initialModel ?
      moment(this.props.initialModel.startTime).add(moment().utcOffset(), 'minutes').toDate() :
      moment().add(7, 'days').add(moment().utcOffset(), 'minutes').minutes(0).seconds(0).toDate();
  }

  public render(): JSX.Element {
    const center = this.getCenter(this.props.initialModel) || {lat: 52.5069, lon: 13.4248, zoom: 3};

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
            <AutoFields fields={['name', 'description', 'regionName', 'region', 'startTime',
              'verifyGpsPositionsOfEdits', 'openFor', 'photoUrl']}/>
            <ErrorsField/>
            <div className="actions">
              {this.props.mode == 'edit' ?
                <SubmitField value={t`Update`}/> :
                <SubmitField value={t`Create`}/>}
              <button className="btn btn-default" onClick={browserHistory.goBack}>{t`Cancel`}</button>
            </div>
          </AutoForm>
        </div>
        <div className="content-right">
          <Map
            accessibilityCloudTileUrlBuilder={() => false}
            {...center}
            maxZoom={18}
            minZoom={3}
            onMoveEnd={this.onMapMoved}
          />
          <section className="map-border">
            <span>{t`zoom or pan to adjust region`}</span>
          </section>
        </div>
      </div>);
  }

  private getCenter(initialModel: IEvent | void) {
    if (initialModel && initialModel.region && initialModel.region.topLeft && initialModel.region.bottomRight) {
      const tl = initialModel.region.topLeft;
      const br = initialModel.region.bottomRight;
      const corner1 = leaflet.latLng(tl.latitude, tl.longitude);
      const corner2 = leaflet.latLng(br.latitude, br.longitude);
      const bounds = leaflet.latLngBounds(corner1, corner2);
      const latLngCenter = bounds.getCenter();

      return {lat: latLngCenter.lat, lon: latLngCenter.lng, bbox: bounds};
    }
    return null;
  }

  private onMapMoved = (params: { lat: number, lon: number, zoom: number, bbox: leaflet.LatLngBounds }) => {
    if (!this.formRef) {
      return;
    }
    const tl = params.bbox.getNorthWest();
    const br = params.bbox.getSouthEast();

    this.formRef.onChange('region', {
      topLeft: {latitude: tl.lat, longitude: tl.lng},
      bottomRight: {latitude: br.lat, longitude: br.lng},
    });
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
        Events.update({_id: id}, {$set: strippedDoc}, {}, (error, count) => {
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
    display: flex;
    position: relative;
  }
  
  .map-border {
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 500;
    overflow: hidden;
    pointer-events: none;
    text-align: center;
    
    span {
      position: relative;
      top: calc(100% - 55px);
      text-shadow: 0 0 2px rgba(0,0,0,0.5);
      color: white;
      font-size: 20px;
      font-weight: 500;
    }
  }
  
  .map-border:before {
    content: '';
    position: absolute;
    left: 30px;
    right: 30px;
    bottom: 60px;
    top: 30px;
    border-radius: 30px;
    box-shadow: 0 0 0 120px rgba(0,0,0,0.25);
  }
`;
