import * as React from 'react';
import styled from 'styled-components';

import BaseForm, { IBaseFormProps } from './BaseForm';

const CreateForm = (props: IBaseFormProps) => {
  return (
  <BaseForm title="Setup a new community" {...props} />
  );
};

export default styled<IBaseFormProps>(CreateForm) `
`;
