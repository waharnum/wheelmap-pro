import * as React from 'react';
import {Link} from 'react-router';
import styled from 'styled-components';
import {t} from 'c-3po';

import {IStyledComponent} from './IStyledComponent';
import {LocationDescriptor} from 'history';

// TODO: Needs binding for current user

const PreviewToggle = (props: IStyledComponent & { to?: LocationDescriptor, toOrganize?: boolean }) => {
  if (!props.to) {
    return null;
  }

  // TODO: Only display if you have rights to organize
  const user = Meteor.user();
  if (!user) {
    return null;
  }

  return (
    <li className={props.className}>
      <Link to={props.to}>{props.toOrganize ? t`Edit view` : t`Public View`}</Link>
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
  
`;
