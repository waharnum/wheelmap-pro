import * as React from 'react';
import styled from 'styled-components';

import MapLayout from '../../layouts/MapLayout';

import { default as PublicHeader, HeaderTitle } from '../../components/PublicHeader';

import Button from '../../components/Button';
import { wrapDataComponent } from '../../components/AsyncDataComponent';
import { IStyledComponent } from '../../components/IStyledComponent';
import { AutoSizedStaticMap } from '../../components/StaticMap';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import { reactiveModelSubscriptionById, IAsyncDataByIdProps } from '../../components/reactiveModelSubscription';

const ShowOrganizationPage = (props: IAsyncDataByIdProps<IOrganization> & IStyledComponent) => {
  return (
    <MapLayout className={props.className}>
      <PublicHeader
        titleComponent={(
          <HeaderTitle
            title={props.model.name}
            logo={<div className="organisation-logo" />}
          />
        )}
        organizeLink={`/organizations/${props.model._id}/organize`}
      />
      <div className="content-area">
        <AutoSizedStaticMap />
      </div>
    </MapLayout>
  );
};

const ShowContainer = reactiveModelSubscriptionById(
    wrapDataComponent<IOrganization,
        IAsyncDataByIdProps<IOrganization | null>,
        IAsyncDataByIdProps<IOrganization>>(ShowOrganizationPage),
    Organizations, 'organizations.by_id');

export default styled(ShowContainer) `
  .organisation-logo::after {
    display: none;
  }
`;
