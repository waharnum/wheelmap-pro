import * as React from 'react';
import styled from 'styled-components';

import { IStyledComponent } from '../components/IStyledComponent';

interface IScrollLayoutProps {
  children: JSX.Element | JSX.Element[];
}

const ScrollableLayout = (props: IStyledComponent & IScrollLayoutProps) => {
  return (
  <div className={props.className + ' scroll-layout'}>
    {props.children}
  </div>
  );
};

export default styled(ScrollableLayout) `
  overflow: auto;
  width: 100%;

  .content-area {
    padding: 24px;
  }

  .scrollable {
  }
`;
