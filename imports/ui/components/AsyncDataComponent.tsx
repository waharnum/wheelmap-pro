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
  <T, InP extends IAsyncDataProps<T | null>, OutP extends IAsyncDataProps<T>>
  (WrappedComponent: InputPropsComponent<InP>,
   notReadyComponent?: JSX.Element,
   dataNotFoundComponent?: JSX.Element) => {

  return class extends React.Component<OutP> {
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
