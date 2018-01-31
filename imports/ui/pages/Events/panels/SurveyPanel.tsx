import styled from 'styled-components';
import * as React from 'react';

import {PlaceInfoSchema, PointGeometry} from '@sozialhelden/ac-format';
import {t} from 'c-3po';
import {IEvent} from '../../../../both/api/events/events';
import {IPlaceInfo} from '../../../../both/api/place-infos/place-infos';
import {IStyledComponent} from '../../../components/IStyledComponent';
import {pickFields} from '../../../../both/lib/simpl-schema-filter';
import {translateAcFormatToUniforms} from '../../../../both/lib/ac-format-uniforms-bridge';
import Questionnaire from '../../../components/Questionaire/Questionnaire';

type Props = {
  event: IEvent;
  place: IPlaceInfo | null;
  onExitSurvey: (model: IPlaceInfo) => void;
  initialPosition?: { lat: number; lon: number; }
} & IStyledComponent;

class SurveyPanel extends React.Component<Props> {
  public render() {
    const {place} = this.props;

    // TODO read from event, hard coded wheelmap schema
    const selectedFields = [
      'properties',
      'properties.name',
      'properties.category',
      'properties.address',
      'properties.address.house',
      'properties.address.street',
      'properties.address.postalCode',
      'properties.address.city',
      'geometry',
      'properties.accessibility',
      'properties.accessibility.entrances',
      'properties.accessibility.entrances.$.isLevel',
      'properties.accessibility.entrances.$.hasSlope',
      'properties.accessibility.entrances.$.hasRemovableRamp',
      'properties.accessibility.entrances.$.stairs',
      'properties.accessibility.entrances.$.stairs.count',
      'properties.accessibility.entrances.$.stairs.stepHeight',
      'properties.accessibility.entrances.$.door',
      'properties.accessibility.entrances.$.door.turningSpaceInFront',
      'properties.accessibility.entrances.$.door.width',
      'properties.accessibility.restrooms',
      'properties.accessibility.restrooms.$.entrance',
      'properties.accessibility.restrooms.$.entrance.isLevel',
      'properties.accessibility.restrooms.$.entrance.hasSlope',
      'properties.accessibility.restrooms.$.entrance.hasRemovableRamp',
      'properties.accessibility.restrooms.$.entrance.stairs',
      'properties.accessibility.restrooms.$.entrance.stairs.count',
      'properties.accessibility.restrooms.$.entrance.stairs.stepHeight',
      'properties.accessibility.restrooms.$.entrance.door',
      'properties.accessibility.restrooms.$.entrance.door.turningSpaceInFront',
      'properties.accessibility.restrooms.$.entrance.door.width',
    ];

    let schema = PlaceInfoSchema;
    if (selectedFields && selectedFields.length > 0) {
      schema = pickFields(schema, selectedFields);
      translateAcFormatToUniforms(schema);
    }

    let initialModel;
    if (place) {
      console.log('Editing existing place!', place._id);
      initialModel = place;
    } else {
      const geometry: PointGeometry | undefined = this.props.initialPosition ? {
        type: 'Point',
        coordinates: [this.props.initialPosition.lat, this.props.initialPosition.lon],
      } : undefined;
      initialModel = {geometry};
    }

    return (
      <Questionnaire
        model={initialModel}
        schema={schema}
        fields={selectedFields}
        onSubmit={this.onSubmit}
        onExitSurvey={this.props.onExitSurvey}
      />
    );
  }

  onSubmit = (model: IPlaceInfo, field: string | null): Promise<Mongo.ObjectID> => {
    return new Promise((resolve, reject) => {
      // FIXME enforce a address.text field
      model.properties.address = Object.assign({text: ''}, model.properties.address);
      Meteor.call('placeInfos.insertForEvent', {
        eventId: this.props.event._id,
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

export default styled(SurveyPanel) `
  // shared between all panels
  flex: 1;
`;
