import * as React from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {
  headerText: string,
  bodyText: string,
  className?: string,
};

const TextBlock = (props: Props) => (
  <div className={`${props.className}`}>
    <header>{props.headerText}</header>
    <article>{props.bodyText}</article>
  </div>
);

export default styled(TextBlock) `
    color:#444;
`;
