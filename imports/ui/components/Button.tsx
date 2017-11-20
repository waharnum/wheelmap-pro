import * as React from 'react';
import {LinkProps, Link} from 'react-router';
import styled from 'styled-components';

import {IStyledComponent} from './IStyledComponent';

const Button = (props: LinkProps & IStyledComponent) => {
  return (<Link {...props} className={`btn ${props.className}`}/>);
};

export default styled(Button) `
&[disabled] {
  pointer-events: none;
}
`;
