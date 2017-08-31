
import * as React from 'react';
import styled from 'styled-components';

import { reactiveModelSubscription, IAsyncDataProps } from '../../components/reactiveModelSubscription';
import { default as AdminHeader, HeaderTitle } from '../../components/AdminHeader';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import { IStyledComponent } from '../../components/IStyledComponent';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import Button from '../../components/Button';

interface IListEntryModelProps {
  model: IOrganization;
}

const ListEntry = (props: IListEntryModelProps) => {
  return (
    <div className="list-entry">
      {props.model.name}
      {props.model.description}
      {props.model.webSite}
      {props.model.logo}
      <Button to={`/organizations/${props.model._id}`}>View</Button>
      {props.model.editableBy(Meteor.userId()) ?
        <Button to={`/organizations/edit/${props.model._id}`}>Edit</Button> : ''}
    </div>
  );
};

const ListOrganizationPage = (props: IStyledComponent & IAsyncDataProps<IOrganization[]>) => {
  if (!props.ready) {
    return (
      <div className={props.className}>Loading…</div>
    );
  }

  return (
    <ScrollableLayout className={props.className}>
      <AdminHeader titleComponent={<HeaderTitle title="All Organizations" />} />
      <section>
      {props.model.map((m) => <ListEntry key={m._id as React.Key} model={m} />)}
      </section>
      <Button to="/organizations/create">Create new organization</Button>
    </ScrollableLayout>
  );
};

const ReactiveListOrganizationPage = reactiveModelSubscription(
  ListOrganizationPage, Organizations, 'organizations', 'organizationMembers.public');

const StyledReactiveListOrganizationPage = styled(ReactiveListOrganizationPage) `
  .list-entry {
    margin:4px;
    padding:10px;
    background-color:white;
    box-shadow:0 0 4px rgba(0,0,0,0.5);
    max-width:800px;
  }
`;

export default StyledReactiveListOrganizationPage;
