angular
  .module('projectDetail')
  .component('projectDetail', {
    template: 'TBD: Detail view for <span>{{ $ctrl.projectId }}</span>',
    controller: ['$routeParams',
      function ProjectDetailController($routeParams) {
        this.projectId = $routeParams.projectId;
      },
    ],
  });
