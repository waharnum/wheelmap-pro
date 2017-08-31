
import styled from 'styled-components';
import { Mongo } from 'meteor/mongo';
import * as React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

export interface IAsyncDataProps {
  ready: boolean;
  model: any | null;
}

export interface IModelProps<TModel> extends IAsyncDataProps {
  params: {
    _id: Mongo.ObjectID;
  };
  model: TModel | null;
}

type ComponentConstructor<P> = React.ComponentClass<P> | React.StatelessComponent<P>;

export const reactiveModelSubscriptionById = <T, InP extends IModelProps<T>>(
  reactComponent: ComponentConstructor<InP>,
  collection: Mongo.Collection<T>,
  byIdSubscription: string) : ComponentConstructor<InP> => {
    const result = createContainer((props: InP) => {
      const id = props.params._id;
      const handle = Meteor.subscribe(byIdSubscription, id);
      const ready = handle.ready();

      return {
        ready,
        model: ready ? collection.findOne({_id: id}) : null,
      } as IModelProps<T>;
    }, reactComponent);

    return result;
};

export interface IListModelProps<TModel> extends IAsyncDataProps {
  model: TModel[];
}

export const reactiveModelSubscription = <T, InP extends IListModelProps<T>>(
  reactComponent: ComponentConstructor<InP>,
  collection: Mongo.Collection<T>,
  ...subscriptions: string[]) : ComponentConstructor<InP> => {
    return reactiveSubscription(reactComponent, () => collection.find().fetch(), ...subscriptions);
};

export interface IGenericSubscription<T> extends IAsyncDataProps {
  model: T | null;
}

export const reactiveSubscription = <T, InP extends IGenericSubscription<T>>(
  reactComponent: ComponentConstructor<InP>,
  fetchFunction: () => T,
  ...subscriptions: string[]) : ComponentConstructor<InP> => {
    const result = createContainer((props: InP) => {
      const allReady = subscriptions.reduce((prev, subscription) => {
        const handle = Meteor.subscribe(subscription);
        return handle.ready();
      }, true);

      return {
        ready: allReady,
        model: allReady ? fetchFunction() : null,
      };
    }, reactComponent);

    return result;
};