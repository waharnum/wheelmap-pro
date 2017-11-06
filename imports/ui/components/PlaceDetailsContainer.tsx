import * as React from 'react';

import styled from 'styled-components';
import {IStyledComponent} from './IStyledComponent';

import Toolbar from 'wheelmap-react/lib/components/Toolbar';
import NodeHeader from 'wheelmap-react/lib/components/NodeToolbar/NodeHeader';
import BasicAccessibility from 'wheelmap-react/lib/components/NodeToolbar/BasicAccessibility';
import AccessibilityDetails from 'wheelmap-react/lib/components/NodeToolbar/AccessibilityDetails';
import AccessibilityExtraInfo from 'wheelmap-react/lib/components/NodeToolbar/AccessibilityExtraInfo';
import NodeFooter from 'wheelmap-react/lib/components/NodeToolbar/NodeFooter';
import LicenseHint from 'wheelmap-react/lib/components/NodeToolbar/LicenseHint';
import Categories from 'wheelmap-react/lib/lib/Categories';
import CloseIcon from 'wheelmap-react/lib/components/icons/actions/Close';
import {IPlaceInfo} from '../../both/api/place-infos/place-infos';


interface IPlaceDetailsContainerProps {
  feature?: IPlaceInfo | null
  onClose: () => void
};

function fetchCategory(feature: IPlaceInfo | undefined | null,
                       callback: (result: { category?: any, parentCategory?: any }) => void) {
  if (!feature) {
    callback({category: null});
    return;
  }
  const properties = feature.properties;
  if (!properties) {
    callback({category: null});
    return;
  }
  const categoryId = properties.category;
  if (!categoryId) {
    callback({category: null});
    return;
  }
  Categories.getCategory(categoryId).then(
    (category) => {
      callback({category});
      return category;
    },
    () => this.setState({category: null}),
  )
    .then(category => category && Categories.getCategory(category.parentIds[0]))
    .then(parentCategory => callback({parentCategory}));
}


class PlaceDetailsContainer extends React.Component<IStyledComponent & IPlaceDetailsContainerProps> {
  public state = {
    category: null,
    parentCategory: null,
  }

  componentDidMount() {
    fetchCategory(this.props.feature, (result) => this.setState(result));
  }

  componentWillReceiveProps(nextProps) {
    fetchCategory(nextProps.feature, (result) => this.setState(result));
  }

  public render(): JSX.Element | null {
    const feature = this.props.feature;
    const featureId = 'my-id';
    const properties = feature ? feature.properties : null;
    const category = this.state.category;
    const parentCategory = this.state.parentCategory;
    const accessibility = properties ? properties.accessibility : {};

    if (!feature) {
      return null;
    }

    return (
      <Toolbar className={this.props.className}>
        <NodeHeader
          feature={feature}
          category={category}
          parentCategory={parentCategory}
        />
        <a className="close-icon" onClick={() => this.props.onClose()}>
          <CloseIcon/>
        </a>
        <BasicAccessibility properties={properties}/>
        <AccessibilityDetails details={accessibility}/>
        <AccessibilityExtraInfo properties={properties}/>
        <NodeFooter
          feature={feature}
          featureId={featureId}
          category={category}
          parentCategory={parentCategory}
        />
        <LicenseHint properties={properties}/>
      </Toolbar>
    );
  }
};

export default styled(PlaceDetailsContainer)`
  .close-icon {
    display: block;
    position: absolute;
    padding: 16px;
    font-size: 30px;
    color: rgba(0,0,0,0.3);
    text-decoration: none;
    text-align: center;
    z-index: 1;
    top: -5px;
    right: 6px;
    pointer-events: all;
    cursor: pointer;
  }
`;

