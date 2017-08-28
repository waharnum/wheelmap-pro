import * as React from 'react';
import styled from 'styled-components';
import { createContainer } from 'meteor/react-meteor-data';
import { Organizations } from '../../../both/api/organizations/organizations';

import AutoForm from 'uniforms-bootstrap3/AutoForm';
import BoolField from 'uniforms-bootstrap3/BoolField';

// this interface is shared by all components using styled, align this with the actual ts def
interface IStyledComponent {
  className?: string;
}

// override field for tocForOrganizationsAccepted
const schema = Organizations.schema;
schema.extend({
  tocForOrganizationsAccepted: {
    uniforms: BoolField,
  },
});

const Create = (props: IStyledComponent) => {
  return (
    <div className={props.className || ''} >
    <h1>Setup a new community</h1>
    <AutoForm schema={schema} />
    </div>);
};

const CreateContainer = createContainer((props: IStyledComponent) => {
  const handle = Meteor.subscribe('Organizations');

  return {
    currentUser: Meteor.user(),
  };
}, Create);

export default styled(CreateContainer) `
    color:#444;
`;
