import * as React from 'react';
import {Link} from 'react-router';
import styled from 'styled-components';

import { IStyledComponent } from '../components/IStyledComponent';

const PreviewToggle = (props : IStyledComponent) => {
  return (
    <li className={props.className}><Link to="#">Public view</Link></li>
  );
};

export default styled(PreviewToggle) `
  position: relative;
  padding: 8px 10px;
  text-decoration: none;
  display: inline-block;

  a {
    font-size: 14px;
  }

  padding-left: 28px;

  ::before {
    position: absolute;
    content: " ";
    width: 24px;
    height: 24px;
    top: 8px;
    left: 0;
    background-image: url(/images/icon-public-view@2x.png); 
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
`;
