import * as React from 'react';

import { IAsyncDataProps } from './reactiveModelSubscription';
import { ComponentConstructor } from 'meteor/react-meteor-data';

interface IAsyncDataComponentProps {
  notReadyComponent: JSX.Element;
  dataNotFoundComponent: JSX.Element;
  children: JSX.Element;
}

const Loading = (props: any) => {
  return (<p>Loading</p>);
};

const DataNotFound = (props: any) => {
  return (<p>Missing data</p>);
};

class AsyncDataComponent extends React.Component<IAsyncDataProps & IAsyncDataComponentProps> {
  public render() {
    if (!this.props.ready) {
      return this.props.notReadyComponent;
    }
    if (!this.props.model) {
      return this.props.dataNotFoundComponent;
    }
    return this.props.children;
  }
};

export default AsyncDataComponent;

type ExpectedType = React.ComponentClass<IAsyncDataProps> | React.StatelessComponent<IAsyncDataProps>;

export const wrapDataComponent = (WrappedComponent: ExpectedType) => {
  // tslint:disable-next-line:max-classes-per-file
  return class extends React.Component<IAsyncDataProps> {
    public render() {
      return (
        <AsyncDataComponent ready={this.props.ready} model={this.props.model}
          notReadyComponent={<Loading />}
          dataNotFoundComponent={<DataNotFound/>}>
          <WrappedComponent {...this.props}/>
        </AsyncDataComponent>
      );
    }
  };
};
