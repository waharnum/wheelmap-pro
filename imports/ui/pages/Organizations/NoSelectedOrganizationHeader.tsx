import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';

import Button from '../../components/Button';
import {IStyledComponent} from '../../components/IStyledComponent';
import {Link} from 'react-router';
import {
  IAsyncDataProps, reactiveSubscription,
} from '../../components/reactiveModelSubscription';
import {Organizations} from '../../../both/api/organizations/organizations';
import OrganizationsDropdown from '../../components/OrganizationsDropdown';

const NoSelectedOrganizationHeader = (props: IAsyncDataProps<number> & IStyledComponent) => {
  if (props.model > 0) {
    return (
      <OrganizationsDropdown className={props.className}>
        <Button to="/organizations/create">{t`Create Organization`}</Button>
      </OrganizationsDropdown>)
  }
  return (<Link to="/" className={`${props.className} logo`}><h1>{t`wheelmap.pro`}</h1></Link>);
}

const ReactiveNoSelectedOrganizationHeader = reactiveSubscription(
  NoSelectedOrganizationHeader,
  () => {
    // TODO: align this filter to only display my organizations
    return Organizations.find({}, {sort: {name: 1}}).count()
  },
  'organizations.my.private');

export default styled<{}>(ReactiveNoSelectedOrganizationHeader) `
`;
