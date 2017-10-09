import {t} from 'c-3po';
import * as React from 'react';

const AccessForbiddenPage = (props) => (
  <section className="not-found">
    {t`Sorry, this should not have happened. You are not authorized for this page.`}
  </section>
);

export default AccessForbiddenPage;
