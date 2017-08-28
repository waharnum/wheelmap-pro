import * as React from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import TextBlock from './TextBlock';

const Home = (props) => (
  <div className={`${props.className}`}>
    <h1>Home!</h1>
    <div className="alert alert-primary" role="alert">
      This is a primary alert—check it out!
    </div>
    <TextBlock headerText="this is a sample text" bodyText="bla" />
    <Button to="/organizations/list">List Organizations</Button>
    <Button to="/organizations/create">Create Organization</Button>
  </div>
);

export default styled(Home) `
    color:#444;
`;
