import styled from 'styled-components';
import * as React from 'react';
import { LinkProps, Link, browserHistory } from 'react-router';

import { IStyledComponent } from '../components/IStyledComponent';

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
    <li className={active === true ? 'active' : ''}>
      <Link to={props.to} onlyActiveOnIndex={props.onlyActiveOnIndex}
            activeClassName={props.activeClassName} activeStyle={props.activeStyle}
            className={props.className} >
        {props.title}
      </Link>
    </li>);
};

export default styled(AdminTab) `
`;
