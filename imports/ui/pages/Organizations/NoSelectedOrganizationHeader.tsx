import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';

import AdminTab from '../../components/AdminTab';
import ScrollableLayout from '../../layouts/ScrollableLayout';
import Button from '../../components/Button';
import AdminHeader from '../../components/AdminHeader';
import {IStyledComponent} from '../../components/IStyledComponent';
import {Hint, HintBox} from '../../components/HintBox';
import {Link} from 'react-router';
import {
  IAsyncDataProps, reactiveSubscription,
} from '../../components/reactiveModelSubscription';
import {wrapDataComponent} from '../../components/AsyncDataComponent';
import {IOrganization, Organizations} from '../../../both/api/organizations/organizations';
import OrganizationsDropdown from '../../components/OrganizationsDropdown';

const NoSelectedOrganizationHeader = (props: IAsyncDataProps<number> & IStyledComponent) => {
  if (props.model > 0) {
    return (
      <OrganizationsDropdown className={props.className}>
        <Button to="/organizations/create">{t`Create Organization`}</Button>
      </OrganizationsDropdown>)
  }
  return (<Link to="/" className={props.className}><h1>{t`wheelmap.pro`}</h1></Link>);
}

const ReactiveNoSelectedOrganizationHeader = reactiveSubscription(
  wrapDataComponent<number, IAsyncDataProps<number | null>,
    IAsyncDataProps<number>>(NoSelectedOrganizationHeader),
  () => {
    // TODO: align this filter to only display my organizations
    return Organizations.find({}, {sort: {name: 1}}).count()
  },
  'organizations.my.private');

export default styled<{}>(ReactiveNoSelectedOrganizationHeader) `
`;
