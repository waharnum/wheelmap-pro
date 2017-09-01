import * as React from 'react';

import { IAsyncDataProps } from './reactiveModelSubscription';
import { ComponentConstructor } from 'meteor/react-meteor-data';

const Loading = (props: any) => {
  return (<p>Loading</p>);
};

const DataNotFound = (props: any) => {
  return (<p>Missing data</p>);
};

type InputPropsComponent<T> = React.ComponentClass<T> | React.StatelessComponent<T>;

export const wrapDataComponent =
  <T, TBeforeProps extends IAsyncDataProps<T | null>, TAfterProps extends IAsyncDataProps<T>>
  (WrappedComponent: InputPropsComponent<TBeforeProps>,
   notReadyComponent?: JSX.Element,
   dataNotFoundComponent?: JSX.Element) : React.ComponentClass<TAfterProps> => {

  return class extends React.Component<TAfterProps> {
    public render() {
      if (!this.props.ready) {
        return notReadyComponent || <Loading />;
      }
      if (!this.props.model) {
        return dataNotFoundComponent || <DataNotFound />;
      }

      return <WrappedComponent {...this.props}/>;
    }
  };
};
