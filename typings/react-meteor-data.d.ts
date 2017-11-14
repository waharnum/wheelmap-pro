// Type definitions for meteor package react-meteor-data.
// Project: https://atmospherejs.com/meteor/react-meteor-data
// Definitions by:
// <https://github.com/fullflavedave>, <https://github.com/kurnos> and <https://github.com/mutaphysis>

declare module 'meteor/react-meteor-data' {
  import * as React from 'react';

  type ComponentConstructor<P> = React.ComponentClass<P> | React.StatelessComponent<P>

  export type withTrackerResult<OutP, InP> = (reactComponent: ComponentConstructor<OutP>) => React.StatelessComponent<InP>

  export function withTracker<InP, D, OutP extends (InP & D)>
  (options: (props: InP) => D | { getMeteorData: (props: InP) => D, pure?: boolean }): withTrackerResult<OutP, InP>;
}
