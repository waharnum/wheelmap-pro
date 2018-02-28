import {t} from 'c-3po';
import * as React from 'react';
import {Dots} from 'react-activity';

import {IPlaceInfo} from '../../both/api/place-infos/place-infos';
import {accessibilityCloudFeatureCache} from 'wheelmap-react/lib/lib/cache/AccessibilityCloudFeatureCache';
import {wheelmapLightweightFeatureCache} from 'wheelmap-react/lib/lib/cache/WheelmapLightweightFeatureCache';
import {wheelmapFeatureCache} from 'wheelmap-react/lib/lib/cache/WheelmapFeatureCache';
import {
  Feature,
  WheelmapFeature,
  AccessibilityCloudFeature,
  isWheelmapFeatureId,
} from 'wheelmap-react/lib/lib/Feature';

export const Loading = (props: { children?: React.ReactNode }) => {
  return (<div className="loading-box">{props.children}<Dots/>{t`Loading`}</div>);
};

export const DataNotFound = (props: any) => {
  return (<p>{t`Missing data`}</p>);
};

// Helper types
type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
type Minus<T, U> = Pick<T, Diff<keyof T, keyof U>>;

type FeatureIdProps = { featureId: string | Mongo.ObjectID | number | null | undefined };
type FeatureProps = { feature: IPlaceInfo };

type ResultProps<TOriginalProps> = Minus<TOriginalProps, FeatureProps> & FeatureIdProps;
type ReturnType<TOriginalProps> = React.ComponentClass<ResultProps<TOriginalProps>>;

type State = {
  loading: boolean
  feature: IPlaceInfo | null,
};

export function LoadFeatureForComponent<TOriginalProps>
(WrappedComponent: React.ComponentClass<TOriginalProps & FeatureProps> | React.StatelessComponent<TOriginalProps & FeatureProps>,
 notReadyComponent?: JSX.Element,
 dataNotFoundComponent?: JSX.Element): ReturnType<TOriginalProps> {

  return class FeatureForComponent extends React.Component<ResultProps<TOriginalProps>, State> {
    state: State = {
      loading: false,
      feature: null,
    };
    request: Promise<IPlaceInfo> | null;

    componentDidMount() {
      this.fetchFeature(this.props.featureId);
    }

    componentWillReceiveProps(nextProps: ResultProps<TOriginalProps>) {
      if (nextProps.featureId !== this.props.featureId) {
        this.request = null;
        this.fetchFeature(nextProps.featureId);
      }
    }

    componentWillUnmount() {
      if (this.request) {
        this.request = null;
      }
    }

    fetchFeature(featureId: string | Mongo.ObjectID | number | null | undefined) {
      this.setState({loading: true});
      const isWheelmap = isWheelmapFeatureId(featureId);

      if (isWheelmap) {
        const feature = wheelmapLightweightFeatureCache.getCachedFeature(featureId);
        if (feature) {
          this.setState({feature});
        }
      }

      const cache = isWheelmap ? wheelmapFeatureCache : accessibilityCloudFeatureCache;
      this.request = cache.getFeature(featureId).then((feature: AccessibilityCloudFeature | WheelmapFeature) => {
        if (!feature || !this.request) {
          return;
        }

        const idOfInterest = this.props.featureId;
        const idProperties = [feature.id, feature.properties.id, feature._id, feature.properties._id];
        const fetchedId = String(idProperties.filter(Boolean)[0]);

        // shown feature might have changed in the mean time. `fetch` requests cannot be aborted so
        // we ignore the response here instead.
        if (fetchedId !== idOfInterest) {
          return;
        }

        if (isWheelmap) {
          // fix weird properties on wheelmap objects
          const properties = feature.properties;
          if (properties) {
            const categoryId = (properties.node_type && properties.node_type.identifier);
            properties.category = categoryId;
          }
        }

        this.setState({feature, loading: false});
        this.request = null;
      }, (reason) => {
        this.setState({feature: null, loading: false});
        this.request = null;
      });
    }

    public render() {
      const {featureId, ...remainingProps} = this.props;

      if (this.state.loading) {
        return notReadyComponent || <Loading/>;
      }
      if (!this.state.feature) {
        return dataNotFoundComponent || <DataNotFound/>;
      }

      return <WrappedComponent {...remainingProps} feature={this.state.feature}/>;
    }
  };
};
