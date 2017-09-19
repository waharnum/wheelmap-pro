import { Mongo } from 'meteor/mongo';
import * as React from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// base type for all data fetched by subscriptions
export interface IAsyncDataProps<T> {
  ready: boolean; // indicates subscriptions are ready
  model: T; // fetched data (or null when not yet loaded)
}

// async data props with page params._id
export interface IAsyncDataByIdProps<TModel> extends IAsyncDataProps<TModel> {
  params: {
    _id: Mongo.ObjectID;
  };
}

// react component input type
type ComponentConstructor<P> = React.ComponentClass<P> | React.StatelessComponent<P>;

/**
 * Wraps a reactComponent into a reactive container that gets updated
 * whenever the by id subscription changes
 *
 * @param reactComponent The component to wrap, needs properties implementing IModelProps
 * @param collection The mongo collection to fetch data from, make sure it is covered by the subscriptions
 * @param byIdSubscriptions The names of the subscription for the object id
 */
export function reactiveModelSubscriptionByParams<T, InP extends IAsyncDataByIdProps<T>>(
  reactComponent: ComponentConstructor<InP>,
  collection: Mongo.Collection<T>,
  ...byIdSubscriptions: string[]): ComponentConstructor<InP> {
    return reactiveSubscriptionByParams(reactComponent, (id) => collection.findOne({_id: id}), ...byIdSubscriptions);
};

export function reactiveSubscriptionByParams<T, InP extends IAsyncDataByIdProps<T>>(
  reactComponent: ComponentConstructor<InP>,
  fetchFunction: (id: Mongo.ObjectID, ...params: any[]) => T | null,
  ...byIdSubscriptions: string[]): ComponentConstructor<InP> {
    if (byIdSubscriptions.length === 0) {
      throw new Meteor.Error(400, 'No subscriptions specified!');
    }

    return createContainer((props: InP) => {
        const {_id, ...restParams} = props.params;
        const ready = byIdSubscriptions.reduce((prev, subscription) => {
            const handle = Meteor.subscribe(subscription, _id, restParams);
            return handle.ready();
        }, true);

        const model = fetchFunction(_id, restParams);
        return {ready: ready || model, model};
    }, reactComponent);
};

/**
 * Wraps a reactComponent into a reactive container that gets updated
 * whenever any of the subscriptions changes
 *
 * @param reactComponent The component to wrap, needs properties implementing IAsyncDataProps
 * @param collection The mongo collection to fetch data from, make sure it is covered by the subscriptions
 * @param subscriptions The subscriptions that will indicate when the component needs to be updated
 */
export function reactiveModelSubscription<T, InP extends IAsyncDataProps<T[]>>(
  reactComponent: ComponentConstructor<InP>,
  collection: Mongo.Collection<T>,
  ...subscriptions: string[]): ComponentConstructor<InP> {
    return reactiveSubscription(reactComponent, () => collection.find().fetch(), ...subscriptions);
};

/**
 * Wraps a reactComponent into a reactive container that gets updated
 * whenever any of the subscriptions changes
 *
 * @param reactComponent The component to wrap, needs properties implementing IAsyncDataProps
 * @param fetchFunction The function used to fetch data, make sure it is covered by the subscriptions
 * @param subscriptions he subscriptions that will indicate when the component needs to be updated
 */
export function reactiveSubscription<T, InP extends IAsyncDataProps<T>>(
  reactComponent: ComponentConstructor<InP>,
  fetchFunction: () => T,
  ...subscriptions: string[]): ComponentConstructor<InP> {
    if (subscriptions.length === 0) {
      throw new Meteor.Error(400, 'No subscriptions specified!');
    }
    return createContainer((props: InP) => {
        const ready = subscriptions.reduce((prev, subscription) => {
            const handle = Meteor.subscribe(subscription);
            return handle.ready();
        }, true);

        const model = fetchFunction();
        return {ready: ready || model, model};
    }, reactComponent);
};
