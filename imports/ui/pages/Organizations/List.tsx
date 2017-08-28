import * as React from 'react';
import styled from 'styled-components';
import { reactiveModelSubscription, IListModelProps } from './reactiveModelSubscription';

import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import Button from '../../components/Button';

// this interface is shared by all components using styled(), align this with the actual ts def later
interface IStyledComponentProps {
  className?: string;
}

interface IShowProps {
  params: {
    _id: Mongo.ObjectID;
  };
}

interface IListEntryModelProps {
  model: IOrganization;
}

const ListEntry = (props: IStyledComponentProps & IListEntryModelProps) => {
  return (
    <div className={props.className || ''}>
      {props.model.name}
      {props.model.description} 
      {props.model.webSite}
      <Button to={`/organizations/${props.model._id}`}>View</Button>
      <Button to={`/organizations/edit/${props.model._id}`}>Edit</Button>
    </div>
  );
};

const List = (props: IStyledComponentProps & IListModelProps<IOrganization>) => {
  if (!props.ready) {
    return (
      <div className={props.className || ''}>Loading…</div>
    );
  }

  return (
    <div className={props.className || ''}>
      {props.model.map((m) => <ListEntry key={m._id as React.Key} model={m} /> )}

      <Button to="/organizations/create">Create new organization</Button> 
    </div>
  );
};

const ListContainer = reactiveModelSubscription(List, Organizations, 'organizations');

export default styled(ListContainer) `
    color:#444;
`;
