import { Meteor } from 'meteor/meteor';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';

import AppRouter from '../imports/ui/AppRouter';
import '../imports/both/api/users/accounts';
import './main.scss';

Meteor.startup(() => {
  ReactRouterSSR.Run(AppRouter);
});
