import * as React from 'react';
import styled from 'styled-components';
import { createContainer } from 'meteor/react-meteor-data';
import { Organizations } from '../../../both/api/organizations/organizations';

const Show = (props) => {
  const _id = props.params._id;

  return (<div className={`${props.className}`}>
    <h1>{props.organization ? props.organization.name : null}</h1>
    {/* {props.isLoading ? <div>Loading…</div> : null} */}
  </div>);
};

const ShowContainer = createContainer((props) => {
  const handle = Meteor.subscribe('Organizations');

  return {
    currentUser: Meteor.user(),
    isLoading: !handle.ready(),
    organization: Organizations.findOne(props.params._id),
  };
}, Show);

export default styled(ShowContainer) `
    color:#444;
`;
