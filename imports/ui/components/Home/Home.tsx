import * as React from 'react';
import styled, { keyframes } from 'styled-components';

const Home = (props) => (
  <div className={`${props.className}`}>
    <h1>Home!</h1>
    <div className="alert alert-primary" role="alert">
      This is a primary alert—check it out!
    </div>
  </div>
);

export default styled(Home) `
    color:red;
`;
