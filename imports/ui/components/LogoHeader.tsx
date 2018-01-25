import {Link} from 'react-router';
import styled from 'styled-components';
import * as React from 'react';
import {LocationDescriptor} from 'history';

import {IStyledComponent} from './IStyledComponent';
import {colors} from '../stylesheets/colors';


type Props = {
  title: string;
  prefixTitle: string;
  logo?: string;
  link?: LocationDescriptor;
} & IStyledComponent;

const LogoHeader = (props: Props) => {
  return (
    <div className={props.className}>
      <Link to={props.link || ''}>
        {props.logo &&
        <div className="small-logo" style={{backgroundImage: `url(${props.logo})`}}/>}
        {(!props.logo && props.prefixTitle) &&
        <h1>{props.prefixTitle}</h1>}
      </Link>
      <h1 className="with-chevron-before">{props.title}</h1>
    </div>
  );
};


export default styled(LogoHeader) `
  display: flex;
  padding: 0px 10px;
  
  border-bottom: solid 1px ${colors.shadowGrey};
    
  .small-logo {
    flex-shrink: 0;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    background-color:  white;
    height: 100%;
    width: 75px;

    a {
      text-overflow: ellipsis;
      display: block;
      overflow: hidden;
      white-space: nowrap;
    }      
  }
  
  h1 {
    position: relative;
    margin: 0;
    padding-right: 8px;
    font-size: 21px;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 50px;
  }
  
  h1.with-chevron-before {
    padding-left: 30px;
    flex: 1;

    &::after {
      position: absolute;
      content: " ";
      left: 10px;
      width: 8px;
      height: 100%;
      background-image: url(/images/chevron-big-right-dark@2x.png); 
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
`;
