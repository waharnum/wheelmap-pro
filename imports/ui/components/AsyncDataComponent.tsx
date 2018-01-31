import {t} from 'c-3po';
import * as React from 'react';
import {Dots} from 'react-activity';

import {IAsyncDataProps} from './reactiveModelSubscription';

export const Loading = (props: { children?: React.ReactNode }) => {
  return (<div className="loading-box">{props.children}<Dots/>{t`Loading`}</div>);
};

export const DataNotFound = (props: any) => {
  return (<p>{t`Missing data`}</p>);
};

type InputPropsComponent<T> = React.ComponentClass<T> | React.StatelessComponent<T>;

/**
 * This function creates a react component that can get a IAsyncDataProps that can contain a null model,
 * and ensures that the ReactComponent passed to this method will only be created if the data is ready
 * and not null.
 *
 * Use this in conjunction with the reactiveSubscription helper.
 *
 * If the data is loading the `notReadyComponent` is rendered instead.
 * If no data is available the `dataNotFoundComponent` is rendered instead.
 *
 * @param WrappedComponent The component to be wrapped. wrapDataComponent will ensure the data is always there.
 * @param notReadyComponent If the data is loading this rendered instead.
 * @param dataNotFoundComponent If no data is available this rendered instead.
 */
export function wrapDataComponent<T, TBeforeProps extends IAsyncDataProps<T | null>,
  TAfterProps extends IAsyncDataProps<T>>(WrappedComponent: InputPropsComponent<TBeforeProps>,
                                          notReadyComponent?: JSX.Element,
                                          dataNotFoundComponent?: JSX.Element): React.ComponentClass<TAfterProps> {

  return class extends React.Component<TAfterProps> {
    public render() {
      if (!this.props.ready) {
        return notReadyComponent || <Loading/>;
      }
      if (!this.props.model) {
        return dataNotFoundComponent || <DataNotFound/>;
      }

      return <WrappedComponent {...this.props}/>;
    }
  };
};
