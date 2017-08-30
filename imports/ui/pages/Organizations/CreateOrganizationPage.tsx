import * as React from 'react';
import styled from 'styled-components';

import OrganizationBaseForm, { IBaseFormProps } from './OrganizationBaseForm';

const CreateOrganizationForm = (props: IBaseFormProps) => {
  return (
  <OrganizationBaseForm title="Setup a new community" {...props} />
  );
};

export default styled<IBaseFormProps>(CreateOrganizationForm) `
`;
