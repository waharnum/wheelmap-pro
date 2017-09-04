import { Meteor } from 'meteor/meteor';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';

import * as moment from 'moment';

import AppRouter from '../imports/ui/AppRouter';
import '../imports/both/api/users/accounts';

import '../imports/ui/stylesheets/colors.scss';
import '../imports/ui/stylesheets/fonts.scss';
import '../imports/ui/stylesheets/common.scss';
import '../imports/ui/stylesheets/forms.scss';

// TODO: i18n according to browser locale
moment.locale('en-us');

Meteor.startup(() => {
  ReactRouterSSR.Run(AppRouter);
});