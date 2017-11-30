import styled from 'styled-components';
import * as React from 'react';
import { LinkProps, Link, browserHistory } from 'react-router';

import { IStyledComponent } from '../components/IStyledComponent';
import { colors } from '../stylesheets/colors';

interface IAdminTabProps {
  title: string;
  active?: boolean;
}

const AdminTab = (props: IAdminTabProps & LinkProps & IStyledComponent) => {
  let active = props.active;
  if (active === undefined || active === null) {
    active = browserHistory.getCurrentLocation().pathname === props.to;
  }
  return (
    <li className={props.className}>
      <Link to={props.to} onlyActiveOnIndex={props.onlyActiveOnIndex}
        activeClassName={props.activeClassName}
        activeStyle={props.activeStyle}
        className={active === true ? 'active' : ''} >
        {props.title}
      </Link>
    </li>);
};

export default styled(AdminTab) `

  display: inline-block;
  margin: 0 24px 0 0 ; 
  
  a {
    display: inline-block;
    font-size: 14px;
    line-height: 36px;
    text-transform: uppercase;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    
    &.active,
    &:hover {
      border-bottom: 2px solid ${colors.linkBlue};
    }
    
    &.active {
      font-weight: 600;
    }

    &:hover {
      color: ${colors.linkBlueLighter} !important;
    }
  }
`;
