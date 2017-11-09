import { t } from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import { browserHistory } from 'react-router';

import ScrollableLayout from '../../layouts/ScrollableLayout';
import Button from '../../components/Button';
import AdminHeader, { HeaderTitle } from '../../components/AdminHeader';
import { IStyledComponent } from '../../components/IStyledComponent';
import { Hint, HintBox } from '../../components/HintBox';
import { Link } from 'react-router';

const NoOrganizationsPage = (props: IStyledComponent) => {
  return (
    <ScrollableLayout className={props.className} id="NoOrganizationsPage">
      <AdminHeader titleComponent={<Link to="/" className="logo"><h1>{t`wheelmap.pro`}</h1></Link>} />
      <div className="content-area scrollable hsplit">
        <div className="content-left">
          <h2>{t`Welcome on board!`}</h2>
          {t`It seems you are not part of any organization yet. Please wait for your invite, or create your own organization.`}
          <section className="cta-create-org">
            <Button className="btn-primary" to="/organizations/create" >{t`Create Organization`}</Button>
          </section>
        </div>
        <div className="content-right">
          <HintBox title={t`Join or create an organization to contribute`}>
            <Hint className="done">
              {t`If you want to contribute to wheelmap.pro you need an organization.`}
            </Hint>
            <Hint className="done">
              {t`Creating an organization is free and without any hidden costs. `}
            </Hint>
          </HintBox>
        </div>
      </div>
    </ScrollableLayout>
  );
};

const StyledNoOrganizationsPage = styled(NoOrganizationsPage) `
`;

export default styled(NoOrganizationsPage) `
  a.logo {
    content: " ";
    width: 269px;
    min-width: 269px;
    height: 51px;
    background-image: url(/images/logo-wheelmappro-invert@2x.png); 
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;     

    h1 {
      visibility: hidden;
      font-size: 24px;
      line-height: 24px !important;
      font-weight: 800 !important;
      letter-spacing: -1px;
    }
  }

  section.cta-create-org {
    display: flex;

    a.btn-primary {
      display: block;
      margin-top: 2em;
    }
  }
`;
