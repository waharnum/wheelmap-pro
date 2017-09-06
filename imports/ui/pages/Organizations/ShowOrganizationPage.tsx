import * as React from 'react';
import styled from 'styled-components';

import MapLayout from '../../layouts/MapLayout';

import { default as PublicHeader, HeaderTitle } from '../../components/PublicHeader';

import Button from '../../components/Button';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import { IStyledComponent } from '../../components/IStyledComponent';
import { AutoSizedStaticMap } from '../../components/StaticMap';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import { reactiveSubscriptionById, IAsyncDataByIdProps } from '../../components/reactiveModelSubscription';
import {IEvent} from '../../../both/api/events/events';

interface IPageModel {
  organization: IOrganization;
  events: IEvent[];
};

const ShowOrganizationPage = (props: IAsyncDataByIdProps<IPageModel> & IStyledComponent) => {
  return (
    <MapLayout className={props.className}>
      <PublicHeader
        titleComponent={(
          <HeaderTitle
            title={props.model.organization.name}
            logo={props.model.organization.logo}
            description={props.model.organization.description}
          />
        )}
        organizeLink={`/organizations/${props.model.organization._id}/organize`}
      />
      <div className="content-area">
        <AutoSizedStaticMap />
      </div>
    </MapLayout>
  );
};

const ReactiveShowOrganisationPage = reactiveSubscriptionById(
  wrapDataComponent<IPageModel,
      IAsyncDataByIdProps<IPageModel | null>,
      IAsyncDataByIdProps<IPageModel>>(ShowOrganizationPage),
  (id ) => {
    const organization = Organizations.findOne(id);
    // fetch model with organization & events in one go
    // TODO: limit this to the actual ongoing events
    return { organization, events: organization ? organization.getEvents() : [] };
  },
  'organizations.by_id.public', 'events.by_organizationId.private');

export default styled(ReactiveShowOrganisationPage) `
`;
