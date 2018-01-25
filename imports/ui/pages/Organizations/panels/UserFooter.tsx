import * as React from 'react';
import styled from 'styled-components';

import {getGravatarImageUrl} from '../../../../both/lib/user-icon';
import {getDisplayedNameForUser} from '../../../../both/lib/user-name';
import {t} from 'c-3po';
import {withTracker} from 'meteor/react-meteor-data';

type UserFooterProps = { onClick: () => void, className?: string };
type UserFooterInternalProps = { ready: boolean, user: Meteor.User | null } & UserFooterProps;

const UserFooter = (props: UserFooterInternalProps) => (
  <footer className={props.className} onClick={props.onClick}>
    {props.user &&
    <img src={getGravatarImageUrl(props.user.profile.gravatarHash)} className="user-icon"/>}
    {props.user && getDisplayedNameForUser(props.user)}
    {!props.user && <span>{t`Sign Up`}/{t`Sign In`}</span>}
  </footer>
);

// listen to current user changes
const UserFooterContainer = withTracker((props: UserFooterProps) => {
  const handle = Meteor.subscribe('users.my.private');
  const ready = handle.ready();
  return {
    ready,
    user: ready ? Meteor.user() : null,
    ...props,
  };
})(UserFooter);

export default styled(UserFooterContainer) `
  padding: 10px 8px 10px 8px;
  text-decoration: none;
  display: inline-block;
  height: fit-content;
  cursor: pointer;
  user-select: none;
  
  a {
    font-size: 14px;
  }
  
  img {
    width: 24px;
    margin-right: 4px;
  }
`;
