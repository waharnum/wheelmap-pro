"use strict";

const c3po = Npm.require('c-3po');
const c3poLoader = Npm.require('c-3po/loader');

Plugin.registerCompiler({
  extensions: ['po'],
}, function () {
  class PoCompiler {
    processFilesForTarget(files) {
      files.forEach((file) => {
        if (!file.getPathInPackage().startsWith("i18n")) {
          return;
        }

        // Process and add the output.
        const translationsObject = c3poLoader.loadFile(file.getPathInPackage());

        console.log('Compiling translation from', file.getPathInPackage(), 'to', `i18n/${file.getBasename()}.json`);

        file.addAsset({
          data: JSON.stringify(translationsObject),
          path: `i18n/${file.getBasename()}.json`
        });
      });
    }
  }

  return new PoCompiler();
});
