import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import {t} from 'c-3po';
import {browserHistory, RouteComponentProps} from 'react-router';
import {withTracker} from 'meteor/react-meteor-data';
import {LocationDescriptor} from 'history';

import {setLoginRedirect} from '../../both/api/users/accounts';

interface IUserProps {
  user: Meteor.User;
  ready: boolean;
  location: LocationDescriptor;
  children: JSX.Element | null;
}

interface IEnsureUserLoggedInProps {
  roles?: string[];
  signInRoute?: LocationDescriptor | ((props: Props) => LocationDescriptor);
}

type Props = IUserProps & IEnsureUserLoggedInProps & RouteComponentProps<{}, {}>;

class EnsureUserLoggedIn extends React.Component<Props> {
  public componentWillMount() {
    this.redirectIfReady();
  }

  public componentDidUpdate() {
    this.redirectIfReady();
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.user) {
      // save page to go back to
      setLoginRedirect(nextProps.location || '/');
    }
  }

  public render(): JSX.Element | null {
    if (!this.props.ready) {
      return <p>{t`Loading...`}</p>;
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
      let signInRoute: LocationDescriptor | undefined;
      if (typeof this.props.signInRoute === 'function') {
        signInRoute = this.props.signInRoute(this.props);
      } else {
        signInRoute = this.props.signInRoute;
      }
      browserHistory.replace(signInRoute || '/signup');
      return;
    }
    if (!this.hasMatchingRole()) {
      // TODO handle no access page?
      browserHistory.replace('/');
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
      isAuthorized = this.props.roles.every(role => userRoles.includes(role));
    }
    return isAuthorized;
  }

  private userAuthorized() {
    return this.isSignedIn() && this.hasMatchingRole();
  }
}

const TrackedEnsureUserLoggedIn = withTracker(() => {
  const handle = Meteor.subscribe('users.my.private');
  const ready = handle.ready();
  return {
    ready,
    user: ready ? Meteor.user() : null,
  };
})(EnsureUserLoggedIn);

export default TrackedEnsureUserLoggedIn as React.StatelessComponent<IEnsureUserLoggedInProps>;
