import * as React from 'react';
import styled from 'styled-components';
import { createContainer } from 'meteor/react-meteor-data';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';

// this interface is shared by all components using styled(), align this with the actual ts def later
interface IStyledComponentProps {
  className?: string;
}

interface IShowProps {
  params: {
    _id: Mongo.ObjectID;
  };
}

interface IShowModelProps {
  model: IOrganization;
  ready: boolean;
}

const Show = (props: IShowProps & IStyledComponentProps & IShowModelProps) => {
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
  </div>
  );
};

const ShowContainer = createContainer((props: IShowProps & IShowModelProps) => {
  const id = props.params._id;
  const handle = Meteor.subscribe('organizations.by_id', id);
  const ready = handle.ready();

  return {
    currentUser: Meteor.user(),
    ready,
    model: ready ? Organizations.findOne({_id: id}) : null,
  };
}, Show);

export default styled(ShowContainer) `
    color:#444;
`;
