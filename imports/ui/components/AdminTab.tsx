import * as React from 'react';
import { LinkProps, Link } from 'react-router';
import styled from 'styled-components';

import { IStyledComponent } from '../components/IStyledComponent';

interface IAdminTabProps {
  title: string;
  active?: boolean;
}

const AdminTab = (props: IAdminTabProps & LinkProps & IStyledComponent) => {
  return (
    <li className={props.active === true ? 'active' : ''}>
    <Link {...props as LinkProps} className={props.className} >{props.title}</Link>
    </li>);
};

export default styled(AdminTab) `
`;
