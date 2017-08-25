import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { render } from 'react-dom';
import { Accounts, STATES } from 'meteor/std:accounts-ui';

import App from './App';
import Login from './components/Login';
import Home from './components/Home';
import Admin from './components/Admin';
import NotFound from './components/NotFound/NotFound';
import TasksContainer from './containers/TasksContainer';


/** Redirect to Login page when user is not logged in */
function forceLogin(location: any, replaceWith: (route: string) => void) {
    if (Meteor.user() === null) {
        replaceWith('/login');
    }
}

export default (
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="/signin" component={() => <Accounts.ui.LoginForm />} />
            <Route path="/signup" component={() => <Accounts.ui.LoginForm formState={STATES.SIGN_UP} />} />
            {/* <Route path="/hello/:name" component={ Hello } /> */}
            <Route path="/admin" component={App} onEnter={forceLogin}>
                <IndexRoute component={Admin} />
            </Route>
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);
