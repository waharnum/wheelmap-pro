import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { IStyledComponent } from '../components/IStyledComponent';

interface IScrollLayoutProps {
  children: JSX.Element | JSX.Element[];
}

const ScrollableLayout = (props: IStyledComponent & IScrollLayoutProps) => {
  return (
  <div className={props.className}>
    {props.children}
  </div>
  );
};

export default styled(ScrollableLayout) `
  .content-area {
    padding: 24px;
  }

  .scrollable {
  }
`;
