import * as React from 'react';
import styled from 'styled-components';

import { reactiveModelSubscription, IListModelProps } from '../../components/reactiveModelSubscription';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import { IStyledComponent } from '../../components/IStyledComponent';
import Button from '../../components/Button';

interface IShowProps {
  params: {
    _id: Mongo.ObjectID;
  };
}

interface IListEntryModelProps {
  model: IOrganization;
}

const ListEntry = (props: IStyledComponent & IListEntryModelProps) => {
  return (
    <div className={props.className || ''}>
      {props.model.name}
      {props.model.description} 
      {props.model.webSite}
      {props.model.logo}
      <Button to={`/organizations/${props.model._id}`}>View</Button>
      {props.model.editableBy(Meteor.user()._id) ? <Button to={`/organizations/edit/${props.model._id}`}>Edit</Button> : ''}
    </div>
  );
};

const StyledListEntry = styled(ListEntry) `
`;

const ListOrganizationPage = (props: IStyledComponent & IListModelProps<IOrganization>) => {
  if (!props.ready) {
    return (
      <div className={props.className || ''}>Loading…</div>
    );
  }

  return (
    <div className={props.className || ''}>
      {props.model.map((m) => <StyledListEntry key={m._id as React.Key} model={m} /> )}

      <Button to="/organizations/create">Create new organization</Button> 
    </div>
  );
};

const ReactiveListOrganizationPage = reactiveModelSubscription(ListOrganizationPage, Organizations, 'organizations');
const StyledReactiveListOrganizationPage = styled(ReactiveListOrganizationPage) `
`;

export default StyledReactiveListOrganizationPage;
