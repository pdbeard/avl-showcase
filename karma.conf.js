module.exports = function (config) {
  config.set({

    basePath: './frontend',

    files: [
      // 'bower_components/angular/angular.js',
      './angular.min.js',
      // 'bower_components/angular-mocks/angular-mocks.js',
      './angular-mocks.js',
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
