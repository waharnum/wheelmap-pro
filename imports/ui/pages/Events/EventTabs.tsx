import * as React from 'react';
import styled from 'styled-components';

import AdminTab from '../../components/AdminTab';
import { IStyledComponent } from '../../components/IStyledComponent';

const EventTabs = (props: IStyledComponent) => {
  return (
    <section className={props.className}>
      <AdminTab to="/" title="Event Overview" active={true} />
      <AdminTab to="/" title="Participants" />
      <AdminTab to="/" title="Statistics" />
    </section>
  );
};

export default styled(EventTabs) `
`;
