angular
  .module('projectDetail')
  .component('projectDetail', {
    // template: 'TBD: Detail view for <span>{{ $ctrl.projectId }}</span>',
    templateUrl: 'project-detail/project-detail.template.html',
    controller: ['$routeParams', 'Api',
      function ProjectDetailController($routeParams, Api) {
        this.projectId = $routeParams.projectId;
        this.project = {};

        this.getProject = () => {
          const api = new Api(`/project/${this.projectId}`);
          api.get().then((response) => {
            this.project = response.data;

            // // add campus info to the form for checkboxes
            // $scope.formdata.campus_checkbox = angular.copy($scope.campuses);
          }, (e) => {
            console.warn(e);
            this.project = {};
          });
        };

        this.getProject();
      },
    ],
  });
