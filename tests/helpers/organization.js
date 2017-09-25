import {BrowserHelper} from "./browser";

const organizationIdRegEx = /organizations\/([\w]+)\/organize/;

export class OrganizationHelper {
  constructor(browser, server) {
    this.browserHelper = BrowserHelper(browser);
    this.browser = browser;
    this.server = server;
  }

  getOrganizations() {
    this.browserHelper.replaceHistory(`/`);
    this.browser.waitForExist('#OrganizeOrganizationPage');
    this.browser.click('#OrganizationDropdown');

    this.browser.waitForExist('.dropdown');

    return this.browser.elements(".dropdown ul li a").value.map(e => {
      const name = e.getText();
      const id = e.getAttribute('href').match(organizationIdRegEx)[1];
      return {name, id};
    })
  }

  create(name) {
    this.submitCreateForm({name, toc: true});
    this.browser.waitForExist('#OrganizeOrganizationPage');
    const match = this.browser.getUrl().match(organizationIdRegEx);
    if (!match) {
      throw new Error("could not determine organization id");
    }
    const id = match[1];
    return id;
  }

  submitCreateForm(fields) {
    // get redirected to right organization page
    this.browserHelper.replaceHistory('/organizations/create');
    this.browser.waitForExist('#CreateOrganizationPage');

    // fill form
    if (fields && fields.name) {
      this.browser.addValue('form input[name="name"]', fields.name);
    }
    if (fields && fields.webSite) {
      this.browser.addValue('form input[name="webSite"]', fields.webSite);
    }
    if (fields && fields.logo) {
      this.browser.addValue('form input[name="logo"]', fields.logo);
      this.browser.pause(100);
    }
    if (fields && fields.toc) {
      this.browser.click('form input[name="tocForOrganizationsAccepted"]');
    }
    // submit
    this.browser.click('input.btn-primary[type="submit"]');
  }
}
