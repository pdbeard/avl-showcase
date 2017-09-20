angular
  .module('showcaseApp')
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider
        .when('/projects/search', {
          template: '<project-list mode="search"></project-list>',
        })
        .when('/projects/featured', {
          template: '<project-list mode="featured"></project-list>',
        })
        .when('/projects/:projectId', {
          template: '<project-detail></project-detail>',
        })
        .when('/projects/:projectId/edit', {
          template: '<project-edit></project-edit>',
        })
        .when('/project-create', {
          template: '<project-create></project-create>',
        })
        .when('/project-create/:projectId', {
          template: '<project-create></project-create>',
        })
        .otherwise('/projects/search');
    },
  ]);
