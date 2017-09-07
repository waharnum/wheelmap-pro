import * as React from 'react';
import styled from 'styled-components';

import { IStyledComponent } from '../components/IStyledComponent';

interface IScrollLayoutProps {
  children: JSX.Element | Array<JSX.Element | null> | null;
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
  
  .hsplit {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .content-left {
      flex-grow: 1;
      margin-right: 24px;
    }

    .content-right {
      max-width: 400px;
    }
  }

  .scrollable {
  }
`;
