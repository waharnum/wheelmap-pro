import {IStyledComponent} from './IStyledComponent';
import * as React from 'react';
import {PropTypes} from 'react';
import * as L from 'leaflet';
import {render, unmountComponentAtNode} from 'react-dom';

interface ICustomMapIconProps {
  children?: React.ReactNode;
  lat: number;
  lon: number;
}

export class CustomMapIcon extends React.Component<IStyledComponent & ICustomMapIconProps> {
  public static contextTypes = {
    map: PropTypes.instanceOf(L.Map),
  }

  state: { marker: L.Marker | null } = {marker: null};

  private tryCreateMapComponents() {
    const map = this.context.map;
    if (!map || this.state.marker) {
      return null;
    }
    const icon = L.divIcon({className: `custom-map-icon ${this.props.className || ''}`, iconSize: undefined});
    const marker = L.marker([this.props.lat, this.props.lon], {icon})
    marker.addTo(map)
    this.setState({marker});
  }

  componentWillMount() {
    this.tryCreateMapComponents();
  }

  componentDidMount() {
    this.tryCreateMapComponents();
    this.renderComponent();
  }

  componentDidUpdate(fromProps) {
    this.tryCreateMapComponents();
    this.renderComponent();
  }

  componentWillUnmount() {
    if (this.state.marker) {
      unmountComponentAtNode(this.state.marker.getElement() as Element);
      this.state.marker.remove();
      this.setState({marker: null});
    }
  }

  public renderComponent() {
    if (!this.state.marker) {
      return null;
    }

    render((
      <div className="marker-root">
        {this.props.children}
      </div>
    ), this.state.marker.getElement() as Element);
  }

  render() {
    return null;
  }
}
