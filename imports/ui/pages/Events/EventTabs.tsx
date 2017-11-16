import styled from 'styled-components';
import * as React from 'react';
import {t} from 'c-3po';

import AdminTab from '../../components/AdminTab';
import {IStyledComponent} from '../../components/IStyledComponent';

interface ITabProps {
  id?: Mongo.ObjectID;
};

const EventTabs = (props: IStyledComponent & ITabProps) => {
  return (
    <section className={props.className}>
      <AdminTab to={`/events/${props.id}/organize`} title={t`Event Overview`}/>
      <AdminTab to={`/events/${props.id}/participants`} title={t`Participants`}/>
      {/* <AdminTab to={`/events/${props.id}/statistics`} title={t`Statistics`}/> */}
      <AdminTab to={`/events/${props.id}/edit`} title={t`Edit`}/>
    </section>
  );
};

export default styled(EventTabs) `
`;
