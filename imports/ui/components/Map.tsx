import * as React from 'react';

import ReactWheelmapMap from 'wheelmap-react/lib/components/Map/Map';
import 'wheelmap-react/src/Map.css'

import config from 'wheelmap-react/lib/lib/config';
import styled from 'styled-components';
import {IStyledComponent} from './IStyledComponent';

class Map extends React.Component<IStyledComponent> {
  public render(): JSX.Element {
    return (
      <ReactWheelmapMap
        className={`wheelmap-map ${this.props.className}`}
        data-component="Map"
        mapboxTileUrl={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${Meteor.settings.public.mapbox}`}
        accessibilityCloudAppToken={Meteor.settings.public.accessibilityCloud}
        wheelmapApiKey={Meteor.settings.public.wheelmap}
        accessibilityFilter={[]}
        toiletFilter={[]}
      />
    );
  }
};

export default styled(Map)`

`;

