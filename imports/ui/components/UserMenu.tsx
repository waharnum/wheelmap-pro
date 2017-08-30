import * as React from 'react';
import {Link} from 'react-router';
import styled from 'styled-components';

import { IStyledComponent } from '../components/IStyledComponent';

const UserMenu = (props : IStyledComponent) => {
  return (
    <li className={props.className}><Link to="/profile">Alex Bright</Link></li>
  );
};

export default styled(UserMenu) `
  position: relative;
  padding: 8px 10px;
  text-decoration: none;
  display: inline-block;

  a {
    font-size: 14px;
  }
  
  padding-right: 26px;

  ::after {
    position: absolute;
    right: 10px;
    top: 10px;
    content: "Í";
    font-family: "iconfield-v03";
    font-size: 14px;
  }
`;
