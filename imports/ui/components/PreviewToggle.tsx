import { TAPi18n } from 'meteor/tap:i18n';
import * as React from 'react';
import {Link} from 'react-router';
import styled from 'styled-components';

import { IStyledComponent } from '../components/IStyledComponent';
import { LocationDescriptor } from 'history';

const PreviewToggle = (props: IStyledComponent & {to?: LocationDescriptor, toOrganize?: boolean}) => {
  if (!props.to) {
    return null;
  }

  return (
    <li className={props.className}>
      <Link to={props.to}>{props.toOrganize ? TAPi18n.__('Edit view') : TAPi18n.__('Public View')}</Link>
    </li>
  );
};

export default styled(PreviewToggle) `
  position: relative;
  padding: 10px 28px 10px 8px;
  text-decoration: none;
  display: inline-block;

  a {
    font-size: 14px;
  }

  ::before {
    position: absolute;
    content: " ";
    width: 24px;
    height: 24px;
    top: 6px;
    left: -18px;
    background-image: url(/images/icon-public-view@2x.png); /* FIXME: to be moved to admin-area */
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  &.admin-area::before {
    background-image: url(/images/icon-admin-view@2x.png); /* white version */     
  }

  &.public-area::before{
    background-image: url(/images/icon-public-view@2x.png); /* anthracite version */      
  }
`;
