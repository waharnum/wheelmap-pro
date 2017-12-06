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
import {browserHistory} from 'react-router';
import {IPlaceInfo} from '../../../both/api/place-infos/place-infos';

interface IPageModel {
  organization: IOrganization;
  event: IEvent;
};

class CreatePlacePage extends React.Component<IAsyncDataByIdProps<IPageModel> & IStyledComponent> {
  public render() {
    const event = this.props.model.event;

    // TODO read from event
    const selectedFields = [
      'properties',
      'properties.name',
      'properties.category',
      'properties.accessibility',
      'properties.accessibility.entrances',
      'properties.accessibility.entrances.$.ratingForWheelchair',
      'properties.accessibility.entrances.$.door',
      'properties.accessibility.entrances.$.door.width',
    ];

    let schema = PlaceInfoSchema;
    if (selectedFields && selectedFields.length > 0) {
      schema = pickFields(schema, selectedFields);
      translateAcFormatToUniforms(schema);
    }

    return (
      <ScrollableLayout className={this.props.className}>
        <Questionnaire
          schema={schema}
          fields={selectedFields}
          onExitSurvey={(model: IPlaceInfo) => browserHistory.replace(`/events/${event._id}/mapping`)}
        />
      </ScrollableLayout>
    );
  }
};

const ReactiveCreatePlacePage = reactiveSubscriptionByParams(
  wrapDataComponent<IPageModel,
    IAsyncDataByIdProps<IPageModel | null>,
    IAsyncDataByIdProps<IPageModel>>(CreatePlacePage),
  (id): IPageModel | null => {
    const event = Events.findOne(id);
    const organization = event ? event.getOrganization() : null;
    // fetch model with organization & events in one go
    return event && organization ? {organization, event} : null;
  }, 'events.by_id.public', 'organizations.by_eventId.public');

export default styled(ReactiveCreatePlacePage) `
`;
