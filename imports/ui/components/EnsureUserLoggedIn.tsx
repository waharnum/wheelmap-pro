
import * as React from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { LocationDescriptor } from 'history';

import { setLoginRedirect } from '../../both/api/users/accounts';

interface IUserProps {
  user: Meteor.User;
  ready: boolean;
  location: LocationDescriptor;
  children: JSX.Element | null;
}

interface IEnsureUserLoggedInProps {
  roles?: string[];
}

class EnsureUserLoggedIn extends React.Component<IUserProps & IEnsureUserLoggedInProps> {

  public componentWillMount() {
    this.redirectIfReady();
  }

  public componentDidUpdate() {
    this.redirectIfReady();
  }

  public componentWillReceiveProps(nextProps) {
    // save page to go back to
    setLoginRedirect(nextProps.location || '/');
  }

  public render(): JSX.Element | null {
    if (!this.props.ready) {
      return (<p>Loading...</p>);
    }

    if (this.userAuthorized()) {
      return this.props.children || null;
    }

    return null;
  }

  private redirectIfReady() {
    if (!this.props.ready) {
      return;
    }
    if (!this.isSignedIn()) {
      browserHistory.replace('/signin');
      return;
    }
    if (!this.hasMatchingRole()) {
      browserHistory.replace('/403');
      return;
    }
  }

  private isSignedIn(): boolean {
    return !!this.props.user;
  }

  private hasMatchingRole() {
    let isAuthorized = true;
    if (this.props.roles) {
      const userRoles = (this.props.user.roles || []) as string[];
      isAuthorized = this.props.roles.every((role) => userRoles.includes(role));
    }
    return isAuthorized;
  }

  private userAuthorized() {
    return this.isSignedIn() && this.hasMatchingRole();
  }
}

export default createContainer((props: IEnsureUserLoggedInProps) => {
  const handle = Meteor.subscribe('users.my');
  const ready = handle.ready();
  return {
    ready,
    user: ready ? Meteor.user() : null,
  };
}, EnsureUserLoggedIn);
