import {t} from 'c-3po';
import * as React from 'react';

const NotFoundPage = (props) => (
  <section className="not-found">
    {t`Sorry, this should not have happened. Page not found.`}
  </section>
);

export default NotFoundPage;
