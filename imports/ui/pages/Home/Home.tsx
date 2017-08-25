import * as React from 'react';
<<<<<<< HEAD:imports/ui/components/Home/Home.tsx
import TextBlock from './TextBlock';
import styled, { keyframes } from 'styled-components';
=======
import styled from 'styled-components';
>>>>>>> Split components into `components` and `pages`:imports/ui/pages/Home/Home.tsx

const Home = (props) => (
  <div className={`${props.className}`}>
    <h1>Home!</h1>
    <div className="alert alert-primary" role="alert">
      This is a primary alert—check it out!
    </div>
    <TextBlock headerText="this is a sample text" bodyText="bla" />
  </div>
);

export default styled(Home) `
    color:#444;
`;
