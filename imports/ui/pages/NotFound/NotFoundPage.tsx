import {t} from 'c-3po';
import * as React from 'react';
import styled from 'styled-components';

const NotFoundPage = (props) => (
  <section className="not-found">
    {t`Sorry, this should not have happened. Page not found.`}
  </section>
);


export default styled(NotFoundPage) `
`;
