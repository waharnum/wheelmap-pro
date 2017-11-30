import { t } from 'c-3po';
import * as L from 'leaflet';
import styled from 'styled-components';
import * as React from 'react';
import * as moment from 'moment';

import { colors } from '../../stylesheets/colors';
import Button from '../../components/Button';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import { IStyledComponent } from '../../components/IStyledComponent';
import { Link } from 'react-router';
import { Hint, HintBox } from '../../components/HintBox';

import { wrapDataComponent } from '../../components/AsyncDataComponent';
import { IOrganization, Organizations } from '../../../both/api/organizations/organizations';

import { reactiveModelSubscriptionByParams, IAsyncDataByIdProps } from '../../components/reactiveModelSubscription';
import OrganizationAdminHeader from './OrganizationAdminHeader';


class AccessibilityCloudPage extends React.Component<IAsyncDataByIdProps<IOrganization> & IStyledComponent> {
  public render(): JSX.Element {
    return (
      <ScrollableLayout id="AccessibilityCloudPage" className={this.props.className}>
        <OrganizationAdminHeader organization={this.props.model} />
        <div className="content-area scrollable hsplitWithStats">
          <div className="content-top">
            <div className='logo-overlay'>
              <div className='logo-accloud'></div>
            </div>
          </div>
          <div className='content-hsplit'>
            <div className="content-left">
              <h2>{t`Let’s collect accessible places together!`}</h2>
              <p>{t`We are a NGO that believes in an inclusive world. Our mission is to make accessibility information easier to find—wherever people need it. That’s why we want to encourage everybody to share this kind of data with each other. accessibility.cloud simplifies sharing and obtaining accessibility data in a standardized, future-proof, easy-to-use way.`}</p>
              <p>{t`While beeing a part of Wheelmap.pro your account has been mirrored to accessibility.cloud. So have a look for yourself.`}</p>
              <a className="btn btn-primary" href='https://www.accessibility.cloud/'>{t`Visit now`}</a>
            </div>
            <div className="content-right">
              <HintBox title={t`Join us – you are already onboard.`}>
                <Hint className="user">
                  {t`You already have an account there.`}
                </Hint>
                <Hint className="cloud">
                  {t`Use our data: Get access to 50+ data sources with more than 1+ mio places.`}
                </Hint>
                <Hint className="share">
                  {t`Share your data. You collected accessibility data yourself? We'd love to see it!.`}
                </Hint>
              </HintBox>
            </div>
          </div>
        </div>
      </ScrollableLayout>
    );
  }
};

const ReactiveAccessibilityCloudPage = reactiveModelSubscriptionByParams(
  wrapDataComponent<IOrganization,
    IAsyncDataByIdProps<IOrganization | null>,
    IAsyncDataByIdProps<IOrganization>>(AccessibilityCloudPage),
  Organizations, 'organizations.by_id.private');


export default styled(ReactiveAccessibilityCloudPage) `

  .content-top {
    width: 100%;
    height: 200px;
    background-image: url(/images/acmap-placeholder@3x.png);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }

    .logo-overlay {
      bottom: 0;
      max-width: 1260px;
      width: 100%;
      min-height: 54px;
      margin-left: auto;
      margin-right: auto;
      
      .logo-accloud {
        margin: 20px;
        content: " ";
        left: 0px;
        top: 0px;
        width: 302px;
        height: 54px;
        background-image: url(/images/logo-accloud@2x.png);
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .content-left {
    max-width: 36em;

    p {
      font-size: 18px;
    }
  }
`;