import * as React from 'react';
import styled from 'styled-components';

import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';
import Button from '../../components/Button';
import { reactiveModelSubscriptionById, IModelProps } from './reactiveModelSubscription';

// this interface is shared by all components using styled(), align this with the actual ts def later
interface IStyledComponentProps {
  className?: string;
}

const Show = (props: IModelProps<IOrganization> & IStyledComponentProps) => {
  const _id = props.params._id;

  if (!props.ready) {
    return (
      <div className={props.className || ''}>Loading…</div>
    );
  }

  if (props.model == null) {
    return (
      <div className={props.className || ''}>Object with id:{props.params._id} was not found!</div>
    );
  }

  return (
  <div className={props.className || ''}>
    <h1>{props.model.name}</h1> 
    <div>{props.model.description}</div>
    <div>{props.model.webSite}</div>
    <Button to={`/organizations/edit/${_id}`}>Edit</Button>
  </div>
  );
};

const ShowContainer = reactiveModelSubscriptionById(Show, Organizations, 'organizations.by_id');

export default styled(ShowContainer) `
    color:#444;
`;
