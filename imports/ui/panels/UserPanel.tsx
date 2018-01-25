import * as React from 'react';
import styled from 'styled-components';
import {Meteor} from 'meteor/meteor';
import {t} from 'c-3po';
import {withTracker} from 'meteor/react-meteor-data';
import {T9n} from 'meteor/softwarerero:accounts-t9n';
import {AutoForm, SubmitField} from 'uniforms-bootstrap3';
import {Accounts, STATES} from 'meteor/std:accounts-ui';

import {ClaimAccountSchema} from '../../both/api/users/accounts';

type UserFooterProps = { className?: string };
type UserFooterInternalProps = { ready: boolean, user: Meteor.User | null } & UserFooterProps;

const GuestUserContent = () => {
  let form: AutoForm = null;
  return (
    <div>
      <h3>{t`Claim your Account`}</h3>
      <AutoForm
        placeholder={true}
        showInlineError={true}
        schema={ClaimAccountSchema}
        submitField={() => (<SubmitField value={t`Claim Account`}/>)}
        ref={(ref) => form = ref}
        onSubmit={(doc) => {
          return new Promise((resolve: (r: any) => void, reject: (error: Error) => void) => {
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
                form.setState({error});
              }
            });
        }}/>
    </div>
  );
};

// TODO sign out returns to welcome page :(
// TODO sign in returns to admin page :(

const UserPanel = (props: UserFooterInternalProps) => (
  <section className={props.className}>
    <Accounts.ui.LoginForm/>
    {(props.user && props.user.guest) ? <GuestUserContent/> : null}
  </section>
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
})(UserPanel);

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
