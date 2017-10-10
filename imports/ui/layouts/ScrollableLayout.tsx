import * as React from 'react';
import styled from 'styled-components';

import {IStyledComponent} from '../components/IStyledComponent';

interface IScrollLayoutProps {
  children: JSX.Element | Array<JSX.Element | null> | null;
  id?: string;
}

const ScrollableLayout = (props: IStyledComponent & IScrollLayoutProps) => {
  return (
    <div className={props.className + ' scroll-layout'} id={props.id}>
      {props.children}
    </div>
  );
};

export default styled(ScrollableLayout) `
  overflow: auto;
  width: 100%;

  .main-header .wrapper {
    max-width: 1260px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .content-area.scrollable {
    max-width: 1260px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }  
  
  .hsplit {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .content-left {
      margin-right: 24px;
    }

    .content-right {
      max-width: 600px;
    }
  }

  @media only screen and (max-width: 1285px) {
    .hsplit {
  
      .content-left {
        padding-left: 24px;
      }
  
      .content-right {
        padding-right: 24px;
      }
    }
  }
`;
