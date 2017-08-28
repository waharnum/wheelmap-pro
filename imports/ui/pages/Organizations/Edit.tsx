import * as React from 'react';
import { LinkProps, Link } from 'react-router';
import styled from 'styled-components';

import Create from './Create';

// this interface is shared by all components using styled(), align this with the actual ts def later
interface IStyledComponentProps {
  className?: string;
}

const Button = (props: LinkProps & IStyledComponentProps) => {
  return (<Link {...props} className={props.className + ' btn btn-default'} />);
};

export default styled(Button) `
`;
