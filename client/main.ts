import {Meteor} from 'meteor/meteor';
import {ReactRouterSSR} from 'meteor/reactrouter:react-router-ssr';

import AppRouter from '../imports/ui/AppRouter';
import '../imports/both/api/users/accounts';

import '../imports/ui/stylesheets/colors.scss';
import '../imports/ui/stylesheets/fonts.scss';
import '../imports/ui/stylesheets/common.scss';
import '../imports/ui/stylesheets/forms.scss';

Meteor.startup(() => {
  ReactRouterSSR.Run(AppRouter);
});
