Package.describe({
  name: 'ff:po-compiler',
  version: '0.0.1',
  summary: 'Compiler plugin that converts .po to .json files usable by c-3po',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'compile-po',
  sources: ['plugin.js'],
  npmDependencies: {
    "c-3po": "0.5.8",
  },
});

Package.onUse(function (api) {
  api.use('isobuild:compiler-plugin@1.0.0');
});
