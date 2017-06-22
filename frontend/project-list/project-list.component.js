angular
  .module('projectList')
  .component('projectList', {
    templateUrl: 'project-list/project-list.template.html',
    controller: ['Api', function ProjectListController(Api) {
      this.campuses = [];
      this.categories = [];
      this.disciplines = [];
      this.projects = [];

      const loadCampuses = () => {
        const api = new Api('/campuses');
        api.get().then((response) => {
          this.campuses = response.data;

          // // add campus info to the form for checkboxes
          // $scope.formdata.campus_checkbox = angular.copy($scope.campuses);
        }, (e) => {
          console.warn(e);
          this.campuses = [];
        });
      };

      const loadCategories = () => {
        const api = new Api('/categories');
        api.get().then((response) => {
          this.categories = response.data;

          // // add campus info to the form for checkboxes
          // this.formdata.category_checkbox = angular.copy(this.categories);
        }, (e) => {
          console.warn(e);
          this.categories = [];
        });
      };

      const loadDisciplines = () => {
        const api = new Api('/disciplines');
        api.get().then((response) => {
          this.disciplines = response.data;

          // // add campus info to the form for checkboxes
          // this.formdata.discipline_checkbox = angular.copy(this.disciplines);
        }, (e) => {
          console.warn(e);
          this.disciplines = [];
        });
      };

      const loadProjects = () => {
        const api = new Api('/projects');
        api.get().then((response) => {
          this.projects = response.data;
          // addStuffToProjects();
        }, (e) => {
          console.warn(e);
          this.projects = [];
        });
      };


      const init = () => {
        loadCampuses();
        loadCategories();
        loadDisciplines();
        loadProjects();
      };

      init();
    }],
  });
