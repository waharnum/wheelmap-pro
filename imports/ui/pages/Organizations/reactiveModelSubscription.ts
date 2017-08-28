
import styled from 'styled-components';
import { Mongo } from 'meteor/mongo';
import * as React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

export interface IModelProps<TModel> {
  params: {
    _id: Mongo.ObjectID;
  };
  model: TModel;
  ready: boolean;
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

export interface IListModelProps<TModel> {
  model: TModel[];
  ready: boolean;
}

export const reactiveModelSubscription = <T, InP extends IListModelProps<T>>(
  reactComponent: ComponentConstructor<InP>,
  collection: Mongo.Collection<T>,
  subscription: string) : ComponentConstructor<InP> => {
    const result = createContainer((props: InP) => {
      const handle = Meteor.subscribe(subscription);
      const ready = handle.ready();

      return {
        ready,
        model: ready ? collection.find().fetch() : [],
      } as IListModelProps<T>;
    }, reactComponent);

    return result;
};
