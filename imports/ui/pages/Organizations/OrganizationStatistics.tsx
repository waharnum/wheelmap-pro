import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';

import {IStyledComponent} from '../../components/IStyledComponent';
import {createContainer} from 'meteor/react-meteor-data';


interface IOrganizationStatistics {
  action?: JSX.Element | null;
};

class OrganizationStatistics extends React.Component<IOrganizationStatistics & IStyledComponent> {
  public render(): JSX.Element | null {
    return (
      <div className="stats organization-stats">
        <section className="participant-stats">
          <span className="participants-invited">70<small>{t`invited`}</small></span>
          <span className="participants-registered key-figure">69<small>{t`registered`}</small></span>
        </section>
        <section className="location-stats">
          <span className="locations-planned">70<small>{t`planned`}</small></span>
          <span className="locations-mapped key-figure">69<small>{t`mapped`}</small></span>
        </section>
        <section className="event-stats">
          <span className="events-planned key-figure">70<small>{t`created`}</small></span>
          <span className="events-completed">69<small>{t`completed`}</small></span>
        </section>
        {this.props.action}
      </div>
    );
  }
}

const OrganizationStatisticsContainer = createContainer(() => {
  return {};
}, OrganizationStatistics);

export default styled<IOrganizationStatistics>(OrganizationStatisticsContainer) `
`;
