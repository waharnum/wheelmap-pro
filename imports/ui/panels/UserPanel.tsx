import styled from 'styled-components';
import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { t } from 'c-3po';
import { withTracker } from 'meteor/react-meteor-data';
import { T9n } from 'meteor/softwarerero:accounts-t9n';
import { AutoForm, SubmitField } from 'uniforms-bootstrap3';
import { Accounts, STATES } from 'meteor/std:accounts-ui';

import { ClaimAccountSchema } from '../../both/api/users/accounts';

type GuestUserState = {
  error?: string | null;
};

class GuestUserContent extends React.Component<{}, GuestUserState> {
  public state: GuestUserState = {
    error: null,
  };

  render() {
    return (
      <div>
        <h3>{t`Claim your Account`}</h3>
        <AutoForm
          placeholder={true}
          showInlineError={true}
          schema={ClaimAccountSchema}
          submitField={() => (<SubmitField value={t`Claim Account`} />)}
          onSubmit={(doc) => {
            return new Promise((resolve: (r: any) => void, reject: (error: Error) => void) => {
              Meteor.call('users.claim', doc.email, (error: Meteor.Error, result: any) => {
                if (error) {
                  // for some reason the message is not translated, we can do this here.
                  this.setState({ error: T9n.get(`error.accounts.${error.reason}`) });
                  reject(new Error());
                } else {
                  resolve(result);
                }
              });
            });
          }} />
        {this.state.error &&
          <div className="error-box alert alert-danger">
            {console.log(this.state.error)}
            {this.state.error}
          </div>}
      </div>
    );
  }
}

type UserPanelProps = { className?: string, onSignedInHook?: () => void, onSignedOutHook?: () => void };
type UserPanelInternalProps = { ready: boolean, user: Meteor.User | null } & UserPanelProps;

const UserPanel = (props: UserPanelInternalProps) => (
  <section className={props.className}>
    <Accounts.ui.LoginForm
      onSignedInHook={props.onSignedInHook}
      onPostSignUpHook={props.onSignedInHook}
      onSignedOutHook={props.onSignedOutHook}
    />
    {(props.user && props.user.guest) ? <GuestUserContent /> : null}
  </section>
);

// listen to current user changes
const UserPanelContainer = withTracker((props: UserPanelProps) => {
  const handle = Meteor.subscribe('users.my.private');
  const ready = handle.ready();
  return {
    ready,
    user: ready ? Meteor.user() : null,
    ...props,
  };
})(UserPanel);

export default styled(UserPanelContainer) `
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
