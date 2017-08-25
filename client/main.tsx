import { Meteor } from 'meteor/meteor';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';
import routes from '../imports/ui/routes';
import './main.scss';

Meteor.startup(() => {
  ReactRouterSSR.Run(
    routes,
  );
});
