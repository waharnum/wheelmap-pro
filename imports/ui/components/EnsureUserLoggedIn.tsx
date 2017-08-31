
import * as React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';

import { setLoginRedirect } from '../../both/api/users/accounts';

interface IUserProps {
  user: Meteor.User;
}

class EnsureUserLoggedIn extends React.Component<any & IUserProps> {

  public componentWillMount() {
    // save page to go back to
    setLoginRedirect(this.props.location);

    if (!this.props.user) {
      browserHistory.replace('/signin');
    }
  }

  public render(): JSX.Element | null | false {
    if (this.props.user) {
      return this.props.children;
    } else {
      return false;
    }
  }
}

export default createContainer((props) => {
  const user = Meteor.user();
  return {
    user,
  };
}, EnsureUserLoggedIn);
