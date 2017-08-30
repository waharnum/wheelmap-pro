import * as React from 'react';
import { LinkProps, Link } from 'react-router';
import styled from 'styled-components';

import { IStyledComponent } from '../components/IStyledComponent';

const Button = (props: LinkProps & IStyledComponent) => {
  return (<Link {...props} className={props.className + ' btn'} />);
};

export default styled(Button) `
`;
