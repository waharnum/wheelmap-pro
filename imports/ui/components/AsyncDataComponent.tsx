import * as React from 'react';

import { IAsyncDataProps } from './reactiveModelSubscription';
import { ComponentConstructor } from 'meteor/react-meteor-data';

const Loading = (props: any) => {
  return (<p>Loading</p>);
};

const DataNotFound = (props: any) => {
  return (<p>Missing data</p>);
};

type InputProps<T> = IAsyncDataProps<T | null>;
type InputPropsComponent<T> = React.ComponentClass<InputProps<T>> | React.StatelessComponent<InputProps<T>>;
type WrappedProps<T> = IAsyncDataProps<any>;

export const wrapDataComponent = <T, Dummy>(WrappedComponent: InputPropsComponent<T>,
  notReadyComponent?: JSX.Element, dataNotFoundComponent?: JSX.Element) => {

  return class extends React.Component<WrappedProps<T>> {
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
