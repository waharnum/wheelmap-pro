
import styled from 'styled-components';
import { Mongo } from 'meteor/mongo';
import * as React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// base type for all data fetched by subscriptions
export interface IAsyncDataProps<T> {
  ready: boolean; // indicates subscriptions are ready
  model: T; // fetched data (or null when not yet loaded)
}

// async data props with page params._id
export interface IModelProps<TModel> extends IAsyncDataProps<TModel> {
  params: {
    _id: Mongo.ObjectID;
  };
}
// async data props for an array of TModel
export type IListModelProps<TModel> = IAsyncDataProps<TModel[]>;

// react component input type
type ComponentConstructor<P> = React.ComponentClass<P> | React.StatelessComponent<P>;

/**
 * Wraps a reactComponent into a reactive container that gets updated
 * whenever the by id subscription changes
 *
 * @param reactComponent The component to wrap, needs properties implementing IModelProps
 * @param collection The mongo collection to fetch data from, make sure it is covered by the subcriptions
 * @param byIdSubscription The name of the subscription for the object specified via id
 */
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
      };
    }, reactComponent);

    return result;
};

/**
 * Wraps a reactComponent into a reactive container that gets updated
 * whenever any of the subscriptions changes
 *
 * @param reactComponent The component to wrap, needs properties implementing IListModelProps
 * @param collection The mongo collection to fetch data from, make sure it is covered by the subcriptions
 * @param subscriptions The subscriptions that will indicate when the component needs to be updated
 */
export const reactiveModelSubscription = <T, InP extends IListModelProps<T>>(
  reactComponent: ComponentConstructor<InP>,
  collection: Mongo.Collection<T>,
  ...subscriptions: string[]) : ComponentConstructor<InP> => {
    return reactiveSubscription(reactComponent, () => collection.find().fetch(), ...subscriptions);
};

/**
 * Wraps a reactComponent into a reactive container that gets updated
 * whenever any of the subscriptions changes
 *
 * @param reactComponent The component to wrap, needs properties implementing IListModelProps
 * @param fetchFunction The function used to fetch data, make sure it is covered by the subcriptions
 * @param subscriptions he subscriptions that will indicate when the component needs to be updated
 */
export const reactiveSubscription = <T, InP extends IAsyncDataProps<T>>(
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
