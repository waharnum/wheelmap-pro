import { wrapDataComponent } from '../../components/AsyncDataComponent';
import * as React from 'react';
import styled from 'styled-components';

import ScrollableLayout from '../../layouts/ScrollableLayout';

import { default as PublicHeader, HeaderTitle } from '../../components/PublicHeader';

import { reactiveModelSubscriptionById, IModelProps } from '../../components/reactiveModelSubscription';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import { IStyledComponent } from '../../components/IStyledComponent';
import Button from '../../components/Button';

const ShowOrganizationPage = (props: IModelProps<IOrganization> & IStyledComponent) => {
  return (
    <ScrollableLayout className={props.className}>
      <PublicHeader
        titleComponent={(
          <HeaderTitle
            title={props.model.name}
            logo={<div className="organisation-logo" />}
          />
        )}
        organizeLink={`/organizations/${props.model._id}/organize`}
      />
      <div className="content-area scrollable">
        <div className={props.className || ''}>
          <div>{props.model.description}</div>
          <div>{props.model.webSite}</div>
          <div>{props.model.logo}</div>
        </div>
      </div>
    </ScrollableLayout>
  );
};

const ShowContainer = reactiveModelSubscriptionById(
      wrapDataComponent<IOrganization, IModelProps<IOrganization | null>, IModelProps<IOrganization>>(ShowOrganizationPage),
      Organizations, 'organizations.by_id');

export default styled(ShowContainer) `
  .organisation-logo::after {
    display: none;
  }
`;
