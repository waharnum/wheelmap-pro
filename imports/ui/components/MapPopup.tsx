import {IStyledComponent} from './IStyledComponent';
import * as React from 'react';
import {PropTypes} from 'react';
import * as L from 'leaflet';
import {render, unmountComponentAtNode} from 'react-dom';

interface ICustomMapIconProps {
  lat: number;
  lon: number;
  interactive?: boolean;
  zIndexOffset?: number;
  children?: React.ReactNode;
  // TODO: this is not yet updated after the marker has been mounted
  additionalLeafletLayers?: Array<L.Layer>;
}

export class CustomMapPopup extends React.Component<IStyledComponent & ICustomMapIconProps> {
  public static contextTypes = {
    map: PropTypes.instanceOf(L.Map),
  }

  state: { popup: L.Marker | null } = {popup: null};
  private layers: Array<L.Layer>;

  private tryCreateMapComponents() {
    const map = this.context.map;
    if (!map || this.state.popup) {
      return null;
    }

    const popup = L.popup({
      className: this.props.className,
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
      autoPan: false,
      offset: [0, 0],
    }).setLatLng([this.props.lat, this.props.lon])
    popup.addTo(map);

    // store the added layers so that the same layers will be removed at the end
    this.layers = this.props.additionalLeafletLayers || [];
    this.layers.forEach((layer) => layer.addTo(map));

    // disable interaction on the popup content
    const element = popup.getElement();
    if (element) {
      L.DomEvent.disableClickPropagation(element);
      L.DomEvent.disableScrollPropagation(element);
      L.DomEvent.on(element, 'contextmenu', L.DomEvent.stopPropagation);
    }

    this.setState({popup});
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
    if (this.state.popup) {
      unmountComponentAtNode(this.state.popup.getElement() as Element);
      this.state.popup.removeFrom(this.context.map);
      this.state.popup.remove();
      this.layers.forEach((layer) => {
        layer.removeFrom(this.context.map);
        layer.remove();
      });
      this.setState({marker: null});
    }
  }

  public renderComponent() {
    if (!this.state.popup || !this.props.children) {
      return null;
    }

    render((
      <div className="popup-root">
        {this.props.children}
      </div>
    ), this.state.popup.getElement() as Element);

    // update the size of the popup, definition missing in @types
    (this.state.popup as any).update();
  }

  render() {
    return null;
  }
}
