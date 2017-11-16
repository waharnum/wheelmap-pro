const fs = require('fs');
const fetch = require('node-fetch');
const base64 = require('base-64');

const project = 'wheelmap-pro';
const resource = 'strings';
const auth = base64.encode(`api:${process.env.TRANSIFEX_API_KEY}`);

const defaultOptions = {
  headers: {
    Authorization: `Basic ${auth}`
  }
};

const baseDir = __dirname + '/../../i18n';
const availableLanguagesUrl = `https://www.transifex.com/api/2/project/${project}/resource/${resource}?details`;

fetch(availableLanguagesUrl, defaultOptions)
.then((response) => response.json())
.then((result) => result.available_languages.map(l => l.code))
.then((codes) => {
  codes.map((code) => {
    const languageResourceUrl =
      `https://www.transifex.com/api/2/project/${project}/resource/${resource}/translation/${code}`;
    fetch(languageResourceUrl, defaultOptions)
    .then((response) => response.json())
    .then((result) => {
      const fileName = code.replace('_', '-');
      fs.writeFileSync(`${baseDir}/${fileName}.po`, result.content, 'utf8');
    });
  });
});
