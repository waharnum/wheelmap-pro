import { t } from 'c-3po';
import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import AdminHeader, {HeaderTitle} from '../../components/AdminHeader';
import {Accounts, STATES} from 'meteor/std:accounts-ui';
import styled from 'styled-components';
import {IStyledComponent} from '../../components/IStyledComponent';
import AdminTab from '../../components/AdminTab';
import {AutoForm} from 'uniforms-bootstrap3';
import {ClaimAccountSchema} from '../../../both/api/users/accounts';
import {createContainer} from 'meteor/react-meteor-data';


const GuestContent = () => (
  <div>
    <h2>{t`Claim your Account`}</h2>
    <AutoForm
      placeholder={true}
      showInlineError={true}
      schema={ClaimAccountSchema}
      onSubmit={(doc) => {
        Meteor.call('users.claim', doc.email, (error, result) => {
          console.log(error, result);
        });
      }}
    />
  </div>
);

const ProfilePage = (props: IStyledComponent & { user: Meteor.User, ready: boolean }) => {
  const user = props.user;
  return (
    <ScrollableLayout id="ProfilePage" className={props.className}>
      <AdminHeader
        titleComponent={<HeaderTitle title="User Profile"/>}
        tabs={
          <section>
            <AdminTab to={`/`} title={t`Home`}/>
          </section>}
      />
      <div className="content-area scrollable">
        {user.guest ? <GuestContent/> : null}
        <Accounts.ui.LoginForm/>
      </div>
    </ScrollableLayout>
  );
};

const ReactiveProfilePage = createContainer((props) => {
  const handle = Meteor.subscribe('users.my.private');
  const ready = handle.ready();
  const user = Meteor.user();
  return {ready: ready || user, user};
}, ProfilePage);

export default styled(ReactiveProfilePage) `
`;
