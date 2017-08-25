import * as React from 'react';
import styled, { keyframes } from 'styled-components';

const Home = (props) => (
    <div className={`${props.className}`}>
        <h1>Home!</h1>
    </div>
);

export default styled(Home) `
    color:red;
`;
