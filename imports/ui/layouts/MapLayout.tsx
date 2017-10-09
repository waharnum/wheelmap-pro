import * as React from 'react';
import styled from 'styled-components';

import {IStyledComponent} from '../components/IStyledComponent';

interface IScrollLayoutProps {
  children: JSX.Element | JSX.Element[];
  id?: string;
}

const MapLayout = (props: IStyledComponent & IScrollLayoutProps) => {
  return (
    <div id={props.id || ''} className={props.className + ' map-layout'}>
      {props.children}
    </div>
  );
};

export default styled(MapLayout) `
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  
  .content-area {
    flex-grow: 1;
    position: relative;
    
    justify-content: center;
    align-content: center;
    display: flex;
    
    .map-overlay {
      position: absolute;
      z-index: 800;
      width: 100%;
      height: 100%;
      pointer-events: none;
      
      * {
        pointer-events: auto;
      }
    }
  }
`;
