import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';

import ScrollableLayout from '../../layouts/ScrollableLayout';
import Button from '../../components/Button';
import AdminHeader from '../../components/AdminHeader';
import {IStyledComponent} from '../../components/IStyledComponent';
import {Hint, HintBox} from '../../components/HintBox';
import {
  IAsyncDataProps, reactiveSubscription,
} from '../../components/reactiveModelSubscription';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import NoSelectedOrganizationHeader from './NoSelectedOrganizationHeader';

const NoOrganizationsPage = (props: IStyledComponent & IAsyncDataProps<IOrganization[]>) => {
  return (
    <ScrollableLayout className={props.className} id="NoOrganizationsPage">
      <AdminHeader
        titleComponent={<NoSelectedOrganizationHeader/>}
      />
      <div className="content-area scrollable hsplit">
        <div className="content-left">
          <h2>{t`Welcome on board!`}</h2>
          {props.model.length == 0 ?
            t`It seems you are not part of any organization yet. Please wait for your invite, or create your own organization.` :
            t`Please choose your organization from the dropdown or create a new organization.`
          }
          <section className="cta-create-org">
            <Button className="btn-primary" to="/organizations/create">{t`Create Organization`}</Button>
          </section>
        </div>
        <div className="content-right">
          <HintBox title={t`Join or create an organization to contribute`}>
            <Hint className="done">
              {t`If you want to contribute to wheelmap.pro you need an organization.`}
            </Hint>
            <Hint className="done">
              {t`Creating an organization is free and without any hidden costs. `}
            </Hint>
          </HintBox>
        </div>
      </div>
    </ScrollableLayout>
  );
};

const ReactivePage = reactiveSubscription(
  wrapDataComponent<IOrganization[], IAsyncDataProps<IOrganization[] | null>,
    IAsyncDataProps<IOrganization[]>>(NoOrganizationsPage),
  // TODO: align this filter to only display my organizations
  () => Organizations.find({}, {sort: {name: 1}}).fetch(),
  'organizations.my.private');

export default styled(ReactivePage) `
  section.cta-create-org {
    display: flex;

    a.btn-primary {
      display: block;
      margin-top: 2em;
    }
  }
`;
