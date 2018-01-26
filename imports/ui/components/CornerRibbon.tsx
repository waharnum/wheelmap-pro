import * as React from 'react';
import styled from 'styled-components';
import {IStyledComponent} from './IStyledComponent';
import {colors} from '../stylesheets/colors';

type Props = {
  title: string;
  position?: 'top-right' | 'bottom-right';
  color: string
} & IStyledComponent;

class CornerRibbon extends React.Component<Props> {

  public render() {
    const {className, title, position} = this.props;

    return (
      <div className={`${className} corner-ribbon ${position || 'top-right'}`}>
        <section>{title}</section>
      </div>
    );
  }
};

export default styled(CornerRibbon) `
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  bottom: 0;
  right: 0px;
  z-index: 5000;
  pointer-events: none;
    
  section {
    background-color: ${(p) => p.color}; 
    position: absolute;
    font-size: 16px;
    font-weight: 400;
    text-transform: uppercase;
    padding: 2px 0px;
    color: white;
    text-align: center;
    width: 300px;
    box-shadow: 0 0 2px 0 ${colors.boxShadow};
    transform-origin: 100% 100%;
  }
  
  &.bottom-right section {
    transform: rotate(-45deg);
    bottom: 140px;
    right: -70px;
  }
  
  &.top-right section {
    transform: rotate(45deg);
    top: 132px;
    right: -52px;
  }
`;
