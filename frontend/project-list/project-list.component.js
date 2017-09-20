angular
  .module('projectList')
  .component('projectList', {
    templateUrl: 'project-list/project-list.template.html',
    bindings: {
      mode: '@',
    },
    controller: ['Api', 'apiHost', function ProjectListController(Api, apiHost) {
      this.campuses = [];
      this.categories = [];
      this.disciplines = [];
      this.projects = [];
      this.searchString = '';
      this.apiHost = apiHost;
      // this.sortBy = 'year';

      const projectsApi = new Api('/projects');
      const searchApi = new Api('/search');

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
        projectsApi.get().then((response) => {
          this.projects = response.data;
          // addStuffToProjects();
        }, (e) => {
          console.warn(e);
          this.projects = [];
        });
      };

      const searchProjects = () => {
        const query = { query_string: this.searchString };
        searchApi.post(query).then((response) => {
          this.projects = response.data;

          this.projects.forEach((result) => {
            console.log(`Project year: ${result.year}`);
            console.log(result.created);
          });
        }, (error) => {
          console.warn(error);
          this.projects = [];
        });
      };

      this.updateSearch = () => (this.searchString === '' ? loadProjects() : searchProjects());

      const init = () => {
        loadCampuses();
        loadCategories();
        loadDisciplines();
        loadProjects();
      };

      init();
    }],
  });
