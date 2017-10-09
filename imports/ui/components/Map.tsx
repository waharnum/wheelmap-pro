import * as React from 'react';

import ReactWheelmapMap from 'wheelmap-react/lib/components/Map/Map';
import 'wheelmap-react/src/Map.css'

import config from 'wheelmap-react/lib/lib/config';
import styled from 'styled-components';
import {IStyledComponent} from './IStyledComponent';

config.mapboxAccessToken = Meteor.settings.public.mapbox;


class Map extends React.Component<IStyledComponent> {
  public render(): JSX.Element {
    return (
      <ReactWheelmapMap className={`wheelmap-map ${this.props.className}`} data-component="Map"/>
    );
  }
};

export default styled(Map)`

`;

