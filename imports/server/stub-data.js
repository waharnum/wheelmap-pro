import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import { TAPi18n } from 'meteor/tap:i18n';

import { Languages } from '/imports/both/api/languages/languages';
import { Licenses } from '/imports/both/api/licenses/licenses';
import { Organizations } from '/imports/both/api/organizations/organizations';
import { PlaceInfos } from '/imports/both/api/place-infos/place-infos';
import { SourceImports } from '/imports/both/api/source-imports/source-imports';
import { Sources } from '/imports/both/api/sources/sources';

import { isAdmin } from '/imports/both/lib/is-admin';

Factory.define('organization', Organizations, {
  name: 'ACME GmbH',
  address: 'Friedrichstr. 123',
  zipCode: '12345',
  city: 'Berlin',
  country: 'DE',
  tocForOrganizationsAccepted: true,
});

Factory.define('language-de', Languages, {
  name: 'Deutsch',
  languageCode: 'de',
});
Factory.define('language-en', Languages, {
  name: 'English',
  languageCode: 'en',
});
Factory.define('language-zh', Languages, {
  name: 'Chinese',
  languageCode: 'zh',
});
Factory.define('language-sp', Languages, {
  name: 'Spanish',
  languageCode: 'sp',
});
Factory.define('language-fr', Languages, {
  name: 'French',
  languageCode: 'fr',
});
Factory.define('language-ru', Languages, {
  name: 'Russian',
  languageCode: 'ru',
});


Factory.define('_license_CC0', Licenses, {
  name: 'Public Domain',
  shortName: 'CC0',
  plainTextSummary: 'The person who associated a work with this deed has dedicated the work to the public domain by waiving all of his or her rights to the work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law. You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission. See Other Information below.',
  websiteURL: 'https://creativecommons.org/publicdomain/zero/1.0/',
  fullTextURL: 'https://creativecommons.org/publicdomain/zero/1.0/legalcode',
  consideredAs: 'CC0',
  requiresAttribution: false,
  requiresShareAlike: false,
});


// ---- JSON SOURCE -------------------------------------------------------------------------

Factory.define('jsonSource', Sources, {
  organizationId: Factory.get('organization'),
  licenseId: Factory.get('_license_CC0'),
  languageId: Factory.get('language-en'),
  name: 'Toilets in Vienna (JSON)',
  primaryRegion: 'Vienna, Austria',
  description: 'All public toilets in vienna (JSON)',
  originWebsiteURL: 'http://data.wien.gv.at',
  shortName: 'JSON Test',
  streamChain: [
    {
      type: 'HTTPDownload',
      parameters: {
        sourceUrl: 'http://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WCANLAGEOGD&srsName=EPSG:4326&outputFormat=json',
      },
    },
    {
      type: 'ConvertToUTF8',
      parameters: {
        fromCharSet: 'utf8',
      },
    },
    {
      type: 'ParseJSONStream',
      parameters: {
        path: 'features.*',
        length: 'totalFeatures',
      },
    },
    {
      type: 'TransformData',
      parameters: {
        mappings: {
          originalId: 'row.id',
          geometry: 'row.geometry',
          category: 'toilets',
          properties: 'row.properties',
          address: 'row.properties[\'STRASSE\'] + \', Bezirk \' + row.properties[\'BEZIRK\'] + \', Vienna, Austria\'',
          'properties-accessibility-withWheelchair': 'row.properties[\'KATEGORIE\'].includes(\'Behindertenkabine\')',
        },
      },
    },
    {
      type: 'ConsoleOutput',
      parameters: {},
    },
    {
      type: 'UpsertPlace',
      parameters: {},
    },
  ],
});

Factory.define('jsonSourceImport', SourceImports, {
  sourceId: Factory.get('jsonSource'),
  // streamDebugInfo: [
  //   {
  //     bytesRead: 1000,
  //     error: null,
  //     request: {
  //       url: Factory.get('source').url,
  //       method: 'GET',
  //       sendTimestamp: +new Date(),
  //       headers: {
  //         host: '127.0.0.1:8081',
  //         connection: 'keep-alive',
  //         'cache-control': 'max-age=0',
  //         accept: 'application/json',
  //         'accept-encoding': 'gzip, deflate, sdch',
  //       },
  //     },
  //     response: {
  //       httpVersion: '1.1',
  //       statusCode: 200,
  //       statusMessage: 'OK',
  //       headers: { 'content-length': '123',
  //         'content-type': 'text/json',
  //         connection: 'keep-alive',
  //         host: 'mysite.com',
  //         accept: '*/*',
  //       },
  //       head: '…',
  //       tail: '…',
  //     },
  //   },
  //   {
  //     bytesRead: 1000,
  //     error: null,
  //   },
  //   {
  //     bytesRead: 1000,
  //     error: 'Some example error that might have happened during reading the JSON',
  //   },
  // ],

  insertedPlaceInfoCount: 0,
  updatedPlaceInfoCount: 0,
});

Factory.define('jsonPlaceInfo', PlaceInfos, {
  sourceId: Factory.get('jsonSource'),
  lastSourceImportId: Factory.get('jsonSourceImport'),
  data: {
    providedId: '234234',
    name: 'Hotel Adlon',
    accessible: 0.2,
  },
  geometry: { type: 'Point', coordinates: [12.077916412746292,54.17957489112234] },
});

// --------------- CSV Source ----------------------------------------------------------
Factory.define('csvSource', Sources, {
  organizationId: Factory.get('organization'),
  licenseId: Factory.get('_license_CC0'),
  languageId: Factory.get('language-en'),
  name: 'Toilets in Rostock (CSV)',
  shortName: 'CSV Test',
  description: 'germany-rostock-toilets (CSV)',
  originWebsiteURL: 'https://geo.sv.rostock.de/download/opendata/toiletten/',
  streamChain: [
    {
      type: 'HTTPDownload',
      parameters: {
        sourceUrl: 'https://geo.sv.rostock.de/download/opendata/toiletten/toiletten.csv',
      },
    },
    {
      type: 'ConvertToUTF8',
      parameters: {
        fromCharSet: 'utf8',
      },
    },
    {
      type: 'ParseCSVStream',
      parameters: {
        header: true,
      },
    },
    {
      type: 'ParseJSONStream',
      parameters: {
        path: '*',
      },
    },
    {
      type: 'TransformData',
      parameters: {
        mappings: {
          originalId: "row['uuid']",
          category: 'toilets',
          geometry: "{ type: 'Point', coordinates: [Number(row['longitude']), Number(row['latitude'])] }",
          name: "'Public toilet in Rostock, ' + row['gemeindeteil_name']",
          address: "row['strasse_name'] + ' ' + row['hausnummer'] + row['hausnummer_zusatz'] + ', ' + row['postleitzahl'] + ' Rostock'",
          'properties-accessibility-withWheelchair': "row['behindertengerecht'] == '1'",
          properties: 'row.properties',
        },
      },
    },
    // {
    //   type: 'ConsoleOutput',
    //   parameters: {},
    // },
    {
      type: 'UpsertPlace',
      parameters: {},
    },
  ],
});

Factory.define('csvSourceImport', SourceImports, {
  sourceId: Factory.get('csvSource'),
  insertedPlaceInfoCount: 2,
  updatedPlaceInfoCount: 1,
});

Factory.define('csvPlaceInfo', PlaceInfos, {
  sourceId: Factory.get('csvSource'),
  lastSourceImportId: Factory.get('csvSourceImport'),
  data: {
    providedId: '234234',
    name: 'Hotel Adlon',
    accessible: 0.2,
  },
  geometry: { type: 'Point', coordinates: [-123.137,49.25134] },
});

// -- Insert to database ------------------------------------------
function createStubData() {
  const languageEN = Factory.create('language-en');
  Factory.create('language-de');
  Factory.create('language-zh');
  Factory.create('language-fr');
  Factory.create('language-sp');
  Factory.create('language-ru');
  const organization = Factory.create('organization');
  const license = Factory.create('_license_CC0', {
    organizationId: organization._id,
  });

  // --- JSON -------------------------------
  const source = Factory.create('jsonSource', {
    organizationId: organization._id,
    languageId: languageEN._id,
    licenseId: license._id,
  });
  const sourceImport = Factory.create('jsonSourceImport', {
    sourceId: source._id,
  });
  const placeInfo = Factory.create('jsonPlaceInfo', {
    sourceId: source._id,
    lastSourceImportId: sourceImport._id,
  });

  console.log({
    license,
    languageEN,
    organization,
    source,
    sourceImport,
    placeInfo,
  });

  // --- CSV -------------------------------
  const csvSource = Factory.create('csvSource', {
    organizationId: organization._id,
    languageId: languageEN._id,
    licenseId: license._id,
  });
  const csvSourceImport = Factory.create('csvSourceImport', {
    sourceId: source._id,
  });
  const csvPlaceInfo = Factory.create('csvPlaceInfo', {
    sourceId: csvSource._id,
    lastSourceImportId: csvSourceImport._id,
  });
  console.log({
    csvSource,
    csvSourceImport,
    csvPlaceInfo,
  });
}

function checkIfAdmin(userId) {
  if (!userId) {
    throw new Meteor.Error(401, TAPi18n.__('Please log in first.'));
  }
  if (!isAdmin(userId)) {
    throw new Meteor.Error(403, TAPi18n.__('Not authorized.'));
  }
}

Meteor.methods({
  createStubData() {
    checkIfAdmin(this.userId);
    createStubData();
  },
  resetDatabase() {
    checkIfAdmin(this.userId);

    const collections = [
      Languages,
      Licenses,
      Organizations,
      PlaceInfos,
      SourceImports,
      Sources,
    ];

    collections.forEach(collection => collection.remove({}));
  },
});

// Create stub data for testing if the DB is empty
Meteor.startup(() => {
  if (Licenses.find().count() === 0) {
    createStubData();
  }
});
