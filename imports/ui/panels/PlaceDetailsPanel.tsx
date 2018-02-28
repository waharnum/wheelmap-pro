import * as React from 'react';

import styled from 'styled-components';
import {IStyledComponent} from '../components/IStyledComponent';


import NodeHeader from 'wheelmap-react/lib/components/NodeToolbar/NodeHeader';
import BasicAccessibility from 'wheelmap-react/lib/components/NodeToolbar/BasicAccessibility';
import AccessibilityDetails from 'wheelmap-react/lib/components/NodeToolbar/AccessibilityDetails';
import AccessibilityExtraInfo from 'wheelmap-react/lib/components/NodeToolbar/AccessibilityExtraInfo';
import NodeFooter from 'wheelmap-react/lib/components/NodeToolbar/NodeFooter';
import LicenseHint from 'wheelmap-react/lib/components/NodeToolbar/LicenseHint';
import Categories from 'wheelmap-react/lib/lib/Categories';
import {getFeatureId} from 'wheelmap-react/lib/lib/Feature';

import {IPlaceInfo} from '../../both/api/place-infos/place-infos';
import {LoadFeatureForComponent} from '../components/LoadFeatureForComponent';

type Props = {
  feature: IPlaceInfo;
  actions?: React.ReactNode | ((feature: IPlaceInfo) => React.ReactNode);
} & IStyledComponent;

function fetchCategory(feature: IPlaceInfo,
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


class PlaceDetailsPanel extends React.Component<Props> {
  public state = {
    category: null,
    parentCategory: null,
  };

  componentDidMount() {
    fetchCategory(this.props.feature, (result) => this.setState(result));
  }

  componentWillReceiveProps(nextProps) {
    fetchCategory(nextProps.feature, (result) => this.setState(result));
  }

  public render(): JSX.Element | null {
    const {feature, actions} = this.props;
    if (!feature) {
      return null;
    }

    const featureId = getFeatureId(feature) || 'unknown-id';
    const properties = feature.properties;
    const category = this.state.category;
    const parentCategory = this.state.parentCategory;
    const accessibility = properties ? properties.accessibility : null;

    return (
      <section className={this.props.className}>
        <NodeHeader
          feature={feature}
          category={category}
          parentCategory={parentCategory}
        />
        {actions &&
        <section className="place-actions">
          {typeof actions === 'function' ? actions(feature) : actions}
        </section>
        }
        <BasicAccessibility properties={properties}/>
        <AccessibilityDetails details={accessibility}/>
        <AccessibilityExtraInfo properties={properties}/>
        {/* Node footer uses Link internally */}
        {/*<NodeFooter*/}
        {/*feature={feature}*/}
        {/*featureId={featureId}*/}
        {/*category={category}*/}
        {/*parentCategory={parentCategory}*/}
        {/*/>*/}
        <LicenseHint properties={properties}/>
      </section>
    );
  }
};

export const StyledPlaceDetailsPanel = styled(PlaceDetailsPanel)`  
  // shared between all panels
  padding: 10px;
  flex: 1;
  // custom styling
  width: 100%;
  
  .place-actions {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    padding: 0 25px;
  }
`;

export default LoadFeatureForComponent(StyledPlaceDetailsPanel);

