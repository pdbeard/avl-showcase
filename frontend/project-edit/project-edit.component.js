angular
  .module('projectEdit')
  .component('projectEdit', {
    templateUrl: 'project-edit/project-edit.template.html',
    controller: ['Api', 'Authentication', '$q', '$routeParams', '$location',
      function ProjectEditController(Api, Authentication, $q, $routeParams, $location) {
        const self = this;
        const EMPTY_PROJECT = {
          title: '',
          description: '',
          url: '',
          year: '',
          image_ref: null,
          campus_ids: [],
          category_ids: [],
          discipline_ids: [],
          tags: [],
          people: '',
        };
        const EMPTY_FORM = {
          tagsString: '',
          peopleObjects: [],
          peopleStrings: [],
          campusCheckboxes: [],
          categoryCheckboxes: [],
          disciplineCheckboxes: [],
          imageData: null,
        }; // form inputs that need to be transformed before submitting
        let campuses = [];
        let categories = [];
        let disciplines = [];

        this.projectId = $routeParams.projectId;
        this.project = angular.copy(EMPTY_PROJECT);
        this.form = angular.copy(EMPTY_FORM);
        this.authentication = Authentication;

        this.goToProjects = () => $location.url('/projects');

        const getCampuses = () => {
          const api = new Api('/campuses');
          api.get().then((response) => {
            campuses = response.data;

            // add campus info to the form for checkboxes
            this.form.campusCheckboxes = angular.copy(campuses);

            // check boxes that belong to this project
            this.project.campus_ids.forEach((campusId) => {
              this.form.campusCheckboxes.find(campus => campus.id === campusId).checked = true;
            });
          }, (e) => {
            console.warn(e);
            campuses = [];
          });
        };

        const getCategories = () => {
          const api = new Api('/categories');
          api.get().then((response) => {
            categories = response.data;

            // add category info to the form for checkboxes
            this.form.categoryCheckboxes = angular.copy(categories);

            // check boxes that belong to this project
            this.project.category_ids.forEach((categoryId) => {
              this.form.categoryCheckboxes.find(category => category.id === categoryId).checked = true;
            });
          }, (e) => {
            console.warn(e);
            categories = [];
          });
        };

        const getDisciplines = () => {
          const api = new Api('/disciplines');
          api.get().then((response) => {
            disciplines = response.data;

            // add discipline info to the form for checkboxes
            this.form.disciplineCheckboxes = angular.copy(disciplines);

            // check boxes that belong to this project
            this.project.discipline_ids.forEach((disciplineId) => {
              this.form.disciplineCheckboxes.find(discipline => discipline.id === disciplineId).checked = true;
            });
          }, (e) => {
            console.warn(e);
            disciplines = [];
          });
        };

        this.createPeopleObjects = () => {
          const peopleStrings = this.project.people.split(';');

          this.form.peopleObjects = peopleStrings.map((personString) => {
            const personStringSplit = personString.split('--');

            return {
              name_first: personStringSplit[0],
              name_last: personStringSplit[1],
            };
          });
        };

        const getProject = () => {
          const api = new Api(`/project/${this.projectId}`);
          api.get().then((response) => {
            this.project = response.data;
            this.form.tagsString = this.project.tags.join(', ');
            this.createPeopleObjects();
            getCampuses();
            getCategories();
            getDisciplines();
          }, (e) => {
            console.warn(e);
            this.project = {};
          });
        };

        const submitProject = () => {
          const api = new Api(`/project/${self.project.id}/edit`);

          // convert people objects into strings
          self.form.peopleStrings = self.form.peopleObjects.map(person => `${person.name_first}--${person.name_last}`);

          // convert people strings into single string
          self.project.people = self.form.peopleStrings.join(';');

          // convert tags string into array
          self.project.tags = self.form.tagsString.split(/\s*,\s*/);

          // add campuses to campus_ids if checked
          self.project.campus_ids = [];
          self.form.campusCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
              self.project.campus_ids.push(checkbox.id);
            }
          });

          // add categories to category_ids if checked
          self.project.category_ids = [];
          self.form.categoryCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
              self.project.category_ids.push(checkbox.id);
            }
          });

          // add disciplines to discipline_ids if checked
          self.project.discipline_ids = [];
          self.form.disciplineCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
              self.project.discipline_ids.push(checkbox.id);
            }
          });

          api.put(self.project).then(() => {
            console.log('edit successful');
            // $scope.successTextAlert = 'Project edited.';
            // $scope.showSuccessAlert = true;
            // resetForm();
          }, (e) => {
            console.log('edit failed');
            console.warn(e);
            // window.alert('Editing the post failed.');
            self.resetForm();
            // $scope.failTextAlert = 'Editing the post failed.';
            // $scope.showFailAlert = true;
          });
        };

        const uploadBlob = function (blob) {
          const d = $q.defer();
          const api = new Api('/images');
          api.post({ blob: btoa(blob) }).then((response) => {
            d.resolve(response);
          }, (response) => {
            if (response.status === 409) {
              d.resolve(response);
            } else {
              d.reject(response);
            }
          });
          return d.promise;
        };

        // create new project
        this.submitForm = function () {
          if (this.form.imageData) {
            uploadBlob(this.form.imageData).then((response) => {
              this.project.image_ref = response.data.digest;
              submitProject();
            }, (e) => {
              console.warn(e);
              window.alert('Image upload failed.');
            });
          } else {
            submitProject();
          }
        };

        this.resetForm = () => {
          // this.project = angular.copy(EMPTY_PROJECT);
          // this.form = angular.copy(EMPTY_FORM);
          // this.form.campusCheckboxes = angular.copy(campuses);
          // this.form.categoryCheckboxes = angular.copy(categories);
          // this.form.disciplineCheckboxes = angular.copy(disciplines);
          getProject();
        };

        getProject();
      },
    ],
  });
