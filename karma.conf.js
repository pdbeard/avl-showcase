module.exports = function (config) {
  config.set({

    basePath: './frontend',

    files: [
      './angular.min.js',
      './angular-mocks.js',
      './angular-route.min.js',
      '**/*.module.js',
      '*!(.module|.spec).js',
      '!(bower_components)/**/*!(.module|.spec).js',
      '**/*.spec.js',
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chromium', 'Firefox'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
    ],

  });
};
