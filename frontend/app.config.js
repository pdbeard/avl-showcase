angular
  .module('showcaseApp')
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider
        .when('/projects', {
          template: '<project-list></project-list>',
        })
        .when('/projects/:projectId', {
          template: '<project-detail></project-detail>',
        })
        .when('/project-create', {
          template: '<project-create></project-create>',
        })
        .otherwise('/projects');
    },
  ]);
