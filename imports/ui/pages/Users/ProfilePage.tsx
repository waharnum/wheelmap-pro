import {t} from 'c-3po';
import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import AdminHeader, {HeaderTitle} from '../../components/AdminHeader';
import {Accounts, STATES} from 'meteor/std:accounts-ui';
import styled from 'styled-components';
import {IStyledComponent} from '../../components/IStyledComponent';
import {createContainer} from 'meteor/react-meteor-data';
import {Link} from 'react-router';


const ProfilePage = (props: IStyledComponent & { user: Meteor.User, ready: boolean }) => {
  return (
    <ScrollableLayout id="ProfilePage" className={props.className}>
      <AdminHeader titleComponent={<Link to="/" className="logo"><h1>{t`wheelmap.pro`}</h1></Link>}/>
      <div className="content-area scrollable">
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
