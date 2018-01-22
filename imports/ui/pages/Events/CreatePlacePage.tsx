import styled from 'styled-components';
import * as React from 'react';

import {PlaceInfoSchema} from '@sozialhelden/ac-format';

import {colors} from '../../stylesheets/colors';
import {IOrganization} from '../../../both/api/organizations/organizations';
import {IEvent, Events} from '../../../both/api/events/events';
import {IStyledComponent} from '../../components/IStyledComponent';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {reactiveSubscriptionByParams, IAsyncDataByIdProps} from '../../components/reactiveModelSubscription';
import Questionnaire from '../../components/Questionaire/Questionnaire';
import {pickFields} from '../../../both/lib/simpl-schema-filter';
import {translateAcFormatToUniforms} from '../../../both/lib/ac-format-uniforms-bridge';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import {browserHistory, WithRouterProps} from 'react-router';
import {IPlaceInfo, PlaceInfos} from '../../../both/api/place-infos/place-infos';
import {t} from 'c-3po';

interface IPageModel {
  organization: IOrganization;
  event: IEvent;
  place: IPlaceInfo | null;
};

type MapParams = { zoom: number; lat: number; lon: number };

type Props = IAsyncDataByIdProps<IPageModel> & IStyledComponent & WithRouterProps;

type LocationState = {
  mapPosition?: MapParams,
  historyBehavior?: 'back' | 'replaceWithMap'
};

class CreatePlacePage extends React.Component<Props> {
  public render() {
    const historyState = this.props.location.state as LocationState;
    const event = this.props.model.event;

    // TODO read from event, hard coded wheelmap schema
    const selectedFields = [
      'properties',
      'properties.​name',
      'properties.​category',
      'properties.​address',
      'properties.​address.​house',
      'properties.​address.​street',
      'properties.​address.​postalCode',
      'properties.​address.​city',
      'geometry',
      'properties.​accessibility',
      'properties.​accessibility.​entrances',
      'properties.​accessibility.​entrances.​$.​isLevel',
      'properties.​accessibility.​entrances.​$.​hasSlope',
      'properties.​accessibility.​entrances.​$.​hasRemovableRamp',
      'properties.​accessibility.​entrances.​$.​stairs',
      'properties.​accessibility.​entrances.​$.​stairs.​count',
      'properties.​accessibility.​entrances.​$.​stairs.​stepHeight',
      'properties.​accessibility.​entrances.​$.​door',
      'properties.​accessibility.​entrances.​$.​door.​turningSpaceInFront',
      'properties.​accessibility.​entrances.​$.​door.​width',
      'properties.​accessibility.​restrooms',
      'properties.​accessibility.​restrooms.​$.​entrance',
      'properties.​accessibility.​restrooms.​$.​entrance.​isLevel',
      'properties.​accessibility.​restrooms.​$.​entrance.​hasSlope',
      'properties.​accessibility.​restrooms.​$.​entrance.​hasRemovableRamp',
      'properties.​accessibility.​restrooms.​$.​entrance.​stairs',
      'properties.​accessibility.​restrooms.​$.​entrance.​stairs.​count',
      'properties.​accessibility.​restrooms.​$.​entrance.​stairs.​stepHeight',
      'properties.​accessibility.​restrooms.​$.​entrance.​door',
      'properties.​accessibility.​restrooms.​$.​entrance.​door.​turningSpaceInFront',
      'properties.​accessibility.​restrooms.​$.​entrance.​door.​width',
    ];

    let schema = PlaceInfoSchema;
    if (selectedFields && selectedFields.length > 0) {
      schema = pickFields(schema, selectedFields);
      translateAcFormatToUniforms(schema);
    }

    let initialModel;
    if (this.props.model.place) {
      console.log('Editing existing place!', this.props.model.place._id);
      initialModel = this.props.model.place;
    } else {
      const geometry = (historyState && historyState.mapPosition) ? {
        type: 'Point',
        coordinates: [historyState.mapPosition.lon, historyState.mapPosition.lat],
      } : undefined;
      initialModel = {geometry};
    }

    return (
      <ScrollableLayout className={this.props.className}>
        <Questionnaire
          model={initialModel}
          schema={schema}
          fields={selectedFields}
          onSubmit={this.onSubmit}
          onExitSurvey={(model: IPlaceInfo) => {
            if (historyState && historyState.historyBehavior === 'back') {
              browserHistory.goBack();
            } else {
              browserHistory.replace(`/events/${event._id}/mapping`);
            }
          }}
        />
      </ScrollableLayout>
    );
  }

  onSubmit = (model: IPlaceInfo, field: string | null): Promise<Mongo.ObjectID> => {
    return new Promise((resolve, reject) => {
      Meteor.call('placeInfos.insertForEvent', {
        eventId: this.props.model.event._id,
        place: model,
      }, (error, result) => {
        if (error) {
          reject(error.reason || t`Unknown error`);
        } else {
          resolve(result);
        }
      });
    });
  };
};

const ReactiveCreatePlacePage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(CreatePlacePage),
  (id, options: { place_id?: string }): IPageModel | null => {

    const event = Events.findOne(id);
    const organization = event ? event.getOrganization() : null;
    const place = PlaceInfos.findOne(options.place_id);

    // fetch model with organization & events in one go
    return event && organization ? {organization, event, place} : null;
  }, 'events.by_id.public', 'organizations.by_eventId.public');

export default styled(ReactiveCreatePlacePage) `
`;
