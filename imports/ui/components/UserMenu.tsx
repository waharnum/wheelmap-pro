import { t } from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';

import { IStyledComponent } from './IStyledComponent';
import { getGravatarImageUrl } from '../../both/lib/user-icon';
import { getDisplayedNameForUser } from '../../both/lib/user-name';
import { createContainer } from 'meteor/react-meteor-data';
import { Accounts, STATES } from 'meteor/std:accounts-ui';
import { T9n } from 'meteor/softwarerero:accounts-t9n';
import { Meteor } from 'meteor/meteor';
import { browserHistory } from 'react-router';
import { AutoForm, SubmitField } from 'uniforms-bootstrap3';
import { ClaimAccountSchema } from '../../both/api/users/accounts';

interface IUserProps {
  user: Meteor.User;
  ready: boolean;
};

const NoUserContent = (props: { onSignInSelected: () => void, onSignUpSelected: () => void }) => (
  <section className="login-menu">
    <a onClick={props.onSignInSelected}>{T9n.get('signIn')}</a>&nbsp;/&nbsp;
    <a onClick={props.onSignUpSelected}>{T9n.get('signUp')}</a>
  </section>
);

const UserContent = (props: { user: Meteor.User }) => (
  <section className="user-menu">
    <img src={getGravatarImageUrl(props.user.profile.gravatarHash)} className="user-icon" />
    {getDisplayedNameForUser(props.user)}
  </section>
);

const GuestUserContent = () => {
  let form: AutoForm = null;
  return (
    <div>
      <h3>{t`Claim your Account`}</h3>
      <AutoForm
        placeholder={true}
        showInlineError={true}
        schema={ClaimAccountSchema}
        submitField={() => (<SubmitField value={t`Claim Account`} />)}
        ref={(ref) => form = ref}
        onSubmit={(doc) => {
          return new Promise((resolve: (any) => void, reject: (error: Error) => void) => {
            Meteor.call('users.claim', doc.email, (error: Meteor.Error, result: any) => {
              if (error) {
                // for some reason the message is not translated, we can do this here.
                reject(new Error(T9n.get(`error.accounts.${error.reason}`)));
              } else {
                resolve(result);
              }
            });
          }).then((result: any) => {
          },
            (error) => {
              if (form) {
                form.setState({ error });
              }
            });
        }} />
    </div>
  );
}

interface IState {
  forcedLoginFormState: any;
  _debug_forceGuest: boolean;
};

class UserMenu extends React.Component<IUserProps & IStyledComponent, IState> {
  public state = {
    forcedLoginFormState: null,
    _debug_forceGuest: false,
  };

  public render(): JSX.Element | null {
    const user = Meteor.user();

    // do not show on sign-up page
    if (browserHistory.getCurrentLocation().pathname.startsWith('/signup')) {
      return null;
    }

    return (
      <div className={this.props.className + ' dropdown'}>
        <div className="dropdown-toggle title-bar" id="UserMenuDropdown" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="true">
          {user ? <UserContent user={user} /> : <NoUserContent
            onSignInSelected={this.onSignInSelected}
            onSignUpSelected={this.onSignUpSelected} />}
        </div>
        <ul className="dropdown-menu" aria-labelledby="UserMenuDropdown">
          <Accounts.ui.LoginForm formState={this.state.forcedLoginFormState} />
          {(this.state._debug_forceGuest || user && user.guest) ? <GuestUserContent /> : null}
        </ul>
      </div>);
  }

  private onSignInSelected = () => {
    this.setState({ forcedLoginFormState: STATES.SIGN_IN });
  }
  private onSignUpSelected = () => {
    this.setState({ forcedLoginFormState: STATES.SIGN_UP });
  }
}

const UserMenuContainer = createContainer(() => {
  const handle = Meteor.subscribe('users.my.private');
  const ready = handle.ready();
  return {
    ready,
    user: ready ? Meteor.user() : null,
  };
}, UserMenu);

export default styled(UserMenuContainer) `
position: relative;
padding: 10px 8px 10px 8px;
text-decoration: none;
display: inline-block;
height: fit-content;

a {
  font-size: 14px;
}

img {
  width: 24px;
  margin-right: 4px;
}

.dropdown-toggle {
  cursor: pointer;
  
  &:after {
    position: absolute;
    // right: -8px;
    top: 11px;
    content: 'Í';
    font-family: 'iconfield-v03';
    font-size: 14px;
  }
}

ul.dropdown-menu {
  position: absolute;
  top: 36px;    
  left: -206px;
      
    form {
      width: 24em;
      padding: 10px;

      fieldset, fieldset .form-group {
         width: 100%;
      }
    }
  }


`;
