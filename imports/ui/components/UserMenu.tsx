import styled from 'styled-components';
import {Link} from 'react-router';
import * as React from 'react';

import { IStyledComponent } from '../components/IStyledComponent';
import { getGravatarImageUrl } from '../../both/lib/user-icon';
import { getDisplayedNameForUser } from '../../both/lib/user-name';

// TODO: needs binding to current user

const UserMenu = (props: IStyledComponent) => {
  return (
    <li className={props.className}>
      <img src={getGravatarImageUrl(Meteor.user().profile.gravatarHash)} className="user-icon" />
      <Link to="/profile">{getDisplayedNameForUser(Meteor.user())}</Link>
    </li>
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

  img {
    width: 24px;
    padding-right: 4px;
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
