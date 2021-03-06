import Map from '../../components/Map';
import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import * as moment from 'moment';
import * as leaflet from 'leaflet';
import {browserHistory} from 'react-router';
import {AutoForm, AutoFields, SubmitField, LongTextField, ErrorsField} from 'uniforms-bootstrap3';

import MapLocationField from '../../components/MapLocationField';
import {Events, IEvent, EventRegion} from '../../../both/api/events/events';
import ImageLinkUrlField from '../../components/ImageLinkUrlField';
import {IStyledComponent} from '../../components/IStyledComponent';
import {bboxToRegion, regionToBbox} from '../../../both/lib/geo-bounding-box';
import {defaultRegion} from '../../../both/api/events/schema';
import DateTimePicker from '../../components/DateTimePicker';


export interface IEventBaseFormProps {
  afterSubmit?: (id: Mongo.ObjectID) => void;
  initialModel?: IEvent;
  mode: 'edit' | 'create';
}

type Partial<T> = {
  [P in keyof T]?: T[P];
  };

interface IBaseFormState {
  model: Partial<IEvent>;
  mapState: 'init' | 'view' | 'move';
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
  startTime: {
    uniforms: {
      component: DateTimePicker,
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
    mapState: 'init',
  } as IBaseFormState;
  private formRef: AutoForm;
  private resetRegion: EventRegion;

  constructor(props: IEventBaseFormProps & IStyledComponent) {
    super(props);

    // extract data from document class
    const initialModel = Object.assign({
      organizationId: Meteor.user().profile.activeOrganizationId,
      status: 'draft',
      openFor: 'inviteOnly',
      region: Object.assign({}, defaultRegion),
    }, this.props.initialModel || {}) as Partial<IEvent>;

    this.state = {model: initialModel, mapState: 'init'};
    this.resetRegion = initialModel.region || defaultRegion;

    this.state.model.startTime = this.props.initialModel ?
      this.props.initialModel.startTime : moment().add(7, 'days').minutes(0).seconds(0).toDate();
  }

  public render(): JSX.Element {
    const center = InternalEventBaseForm.getCenter(this.state.model.region) || {lat: 52.5069, lon: 13.4248, zoom: 3};

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
          {this.state.mapState == 'move' ?
            (<section className="accept-map-changes">
              <div>
                {t`Set this region as the mapping area?`}
                <button className="btn btn-default" onClick={this.onMapReset}>{t`Reset`}</button>
                <button className="btn btn-primary" onClick={this.onMapAccept}>{t`Save`}</button>
              </div>
            </section>) : null
          }
        </div>
      </div>);
  }

  public componentDidMount() {
    this.setState({mapState: 'view'});
  }

  private static getCenter(region: EventRegion | null | undefined) {
    if (region && region.topLeft && region.bottomRight) {
      const bbox = regionToBbox(region);
      return {bbox};
    }
    return null;
  }

  private onMapReset = () => {
    const region = Object.assign({}, this.resetRegion);
    this.formRef.onChange('region', region);
    const model = Object.assign({}, this.state.model, {region});
    this.setState({mapState: 'view', model});
  };

  private onMapAccept = () => {
    this.resetRegion = this.state.model.region || defaultRegion;
    this.setState({mapState: 'view'});
  };

  private onMapMoved = (params: { lat: number, lon: number, zoom: number, bbox: leaflet.LatLngBounds }) => {
    if (!this.formRef || this.state.mapState == 'init') {
      return;
    }

    if (this.state.model.region) {
      const prevBbox = regionToBbox(this.state.model.region);
      if (prevBbox.equals(params.bbox)) {
        return;
      }
    }

    const region = bboxToRegion(params.bbox);

    const resetBbox = regionToBbox(this.resetRegion);
    if (this.state.mapState == 'view' && !resetBbox.equals(params.bbox)) {
      const model = Object.assign({}, this.state.model, {region});
      this.setState({mapState: 'move', model});
    }
    else if (this.state.mapState == 'move' && resetBbox.equals(params.bbox)) {
      const model = Object.assign({}, this.state.model, {region: this.resetRegion});
      this.setState({mapState: 'view', model});
    }

    this.formRef.onChange('region', region);
  };

  private onChangeModel = (model) => {
    this.setState({model});
  };

  private storeFormReference = (ref: AutoForm) => {
    this.formRef = ref;
  };

  private onSubmit = (doc: IEvent) => {
    // reset map state
    if (this.state.mapState == 'move') {
      this.onMapReset();
    }

    return new Promise((resolve: (id: Mongo.ObjectID) => void, reject: (error: Error) => void) => {
      const id = this.state.model._id;
      // remove id
      const {_id, ...strippedDoc} = doc;
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
  };
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
  
  .accept-map-changes {
    display: flex;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: 1000;
    justify-content: center;
    
    div {
      background: white;
      padding: 10px 15px;
      border-radius: 2px;
      border: 1px solid #ccc;
      text-align: center;
      margin: 30px 45px;
      
      button {
        margin-left: 15px;
      }
    }
  }
`;
