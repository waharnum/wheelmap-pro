import {t} from 'c-3po';
import * as React from 'react';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import AdminHeader, {HeaderTitle} from '../../components/AdminHeader';
import {Accounts, STATES} from 'meteor/std:accounts-ui';
import styled from 'styled-components';
import {IStyledComponent} from '../../components/IStyledComponent';
import {AutoForm, SubmitField} from 'uniforms-bootstrap3';
import {Hint, HintBox} from '../../components/HintBox';
import {Link, RouteComponentProps} from 'react-router';


const SignUpPage = (props: IStyledComponent & RouteComponentProps<{}, {}>) => {
  const redirectTarget = props.location.state && props.location.state.afterSignIn && props.location.state.afterSignIn.pathname;

  return (
    <ScrollableLayout id="ProfilePage" className={props.className}>
      <AdminHeader titleComponent={<Link to="/" className="logo"><h1>{t`wheelmap.pro`}</h1></Link>}/>
      <div className="content-area scrollable hsplit">
        <div className="content-left">
          <h2>{t`Create an account`}</h2>
          <Accounts.ui.LoginForm formState={STATES.SIGN_UP}
                                 onSignedInHook={() => {
                                   if (redirectTarget) {
                                     props.router.replace(redirectTarget);
                                   }
                                 }}
                                 onPostSignUpHook={() => {
                                   if (redirectTarget) {
                                     props.router.replace(redirectTarget);
                                   }
                                 }}/>
        </div>
        <div className="content-right">
          <HintBox title={t`Join us at wheelmap.pro!`}>
            <Hint className="done">
              {t`Signing up is free and without any hidden costs. `}
            </Hint>
            <Hint className="done">
              {t`We promise to never share your email address with a 3rd party or send you unwanted news or spam.`}
            </Hint>
          </HintBox>
        </div>
      </div>
    </ScrollableLayout>
  );
};

export default styled(SignUpPage) `
`;
