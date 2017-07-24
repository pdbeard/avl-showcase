angular
  .module('projectDetail')
  .component('projectDetail', {
    templateUrl: 'project-detail/project-detail.template.html',
    controller: ['$routeParams', '$location', 'Api', 'Authentication',
      function ProjectDetailController($routeParams, $location, Api, Authentication) {
        this.projectId = $routeParams.projectId;
        this.project = {};
        this.peopleObjects = [];
        this.campuses = [];
        this.campusNames = [];
        this.categories = [];
        this.categoryNames = [];
        this.disciplines = [];
        this.disciplineNames = [];
        this.authentication = Authentication;

        this.goToProjects = () => $location.url('/projects');
        this.goToEdit = () => $location.url(`/projects/${this.projectId}/edit`);

        this.deleteProject = () => {
          const api = new Api(`/projects/${this.projectId}`);
          api.delete().then((response) => {
            console.log(response);
            console.log('project deleted!');
            $location.url('/projects');
            // $scope.successTextAlert = 'Project Deleted!';
            // $scope.showSuccessAlert = true;
          }, (e) => {
            console.warn(e);
            window.alert('Deleting the post failed.');
            // $scope.failTextAlert = 'Deleting the projected failed.';
            // $scope.showFailAlert = true;
          });
        };

        this.createPeopleObjects = () => {
          const peopleStrings = this.project.people.split(';');

          this.peopleObjects = peopleStrings.map((personString) => {
            const personStringSplit = personString.split('--');

            return {
              name_first: personStringSplit[0],
              name_last: personStringSplit[1],
            };
          });
        };

        this.createCampusNames = () => {
          this.campusNames = this.project.campus_ids.map(
            id => this.campuses.find(campus => campus.id === id).name,
          );
        };

        this.createCategoryNames = () => {
          this.categoryNames = this.project.category_ids.map(
            id => this.categories.find(category => category.id === id).name,
          );
        };

        this.createDisciplineNames = () => {
          this.disciplineNames = this.project.discipline_ids.map(
            id => this.disciplines.find(discipline => discipline.id === id).name,
          );
        };

        const getCampuses = () => {
          const api = new Api('/campuses');
          api.get().then((response) => {
            this.campuses = response.data;
            this.createCampusNames();
          }, (e) => {
            console.warn(e);
            this.campuses = [];
          });
        };

        const getCategories = () => {
          const api = new Api('/categories');
          api.get().then((response) => {
            this.categories = response.data;
            this.createCategoryNames();
          }, (e) => {
            console.warn(e);
            this.categories = [];
          });
        };

        const getDisciplines = () => {
          const api = new Api('/disciplines');
          api.get().then((response) => {
            this.disciplines = response.data;
            this.createDisciplineNames();
          }, (e) => {
            console.warn(e);
            this.disciplines = [];
          });
        };

        const getProject = () => {
          const api = new Api(`/project/${this.projectId}`);
          api.get().then((response) => {
            this.project = response.data;
            this.createPeopleObjects();
            getCampuses();
            getCategories();
            getDisciplines();
          }, (e) => {
            console.warn(e);
            this.project = {};
          });
        };

        getProject();
      },
    ],
  });
