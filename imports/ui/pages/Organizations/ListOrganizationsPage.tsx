import * as React from 'react';
import styled from 'styled-components';

import { reactiveModelSubscription, IListModelProps } from '../../components/reactiveModelSubscription';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import { IStyledComponent } from '../../components/IStyledComponent';
import Button from '../../components/Button';

interface IListEntryModelProps {
  model: IOrganization;
}

const ListEntry = (props: IStyledComponent & IListEntryModelProps) => {
  return (
    <div className="list-entry">
      {props.model.name}
      {props.model.description}
      {props.model.webSite}
      {props.model.logo}
      <Button to={`/organizations/${props.model._id}`}>View</Button>
      {props.model.editableBy(Meteor.userId()) ? <Button to={`/organizations/edit/${props.model._id}`}>Edit</Button> : ''}
    </div>
  );
};

const ListOrganizationPage = (props: IStyledComponent & IListModelProps<IOrganization>) => {
  if (!props.ready) {
    return (
      <div className={props.className || ''}>Loading…</div>
    );
  }

  return (
    <div className={props.className || ''}>
      <h2>All Organizations</h2>
      {props.model.map((m) => <ListEntry key={m._id as React.Key} model={m} />)}
      <Button to="/organizations/create">Create new organization</Button>
    </div>
  );
};

const ReactiveListOrganizationPage = reactiveModelSubscription(ListOrganizationPage, Organizations, 'organizations', 'organizationMembers.public');
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
