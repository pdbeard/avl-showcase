angular
  .module('projectCreate')
  .component('projectCreate', {
    templateUrl: 'project-create/project-create.template.html',
    controller: ['Api', 'Authentication', '$q',
      function ProjectCreateController(Api, Authentication, $q) {
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

        this.project = angular.copy(EMPTY_PROJECT);
        this.form = angular.copy(EMPTY_FORM);
        this.isAdmin = () => Authentication.isAdmin();

        const submitProject = function submitProject() {
          const api = new Api('/projects');

          // convert people objects into strings
          self.form.peopleStrings = self.form.peopleObjects.map(person => `${person.name_first}--${person.name_last}`);

          // convert people strings into single string
          self.project.people = self.form.peopleStrings.join(';');

          // convert tags string into array
          self.project.tags = self.form.tagsString.split(/\s*,\s*/);

          // add campuses to campus_ids if checked
          // $scope.formdata.campus_ids = [];
          self.form.campusCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
              self.project.campus_ids.push(checkbox.id);
            }
          });

          // add categories to category_ids if checked
          // $scope.formdata.category_ids = [];
          self.form.categoryCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
              self.project.category_ids.push(checkbox.id);
            }
          });

          // add disciplines to discipline_ids if checked
          // $scope.formdata.discipline_ids = [];
          self.form.disciplineCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
              self.project.discipline_ids.push(checkbox.id);
            }
          });

          api.post(self.project).then((response) => {
            // const projects = response.data;
            // for (let i = 0; i < projects.length; i += 1) {
            //   $scope.projects.unshift(projects[0]);
            // }
            // $scope.successTextAlert = 'Project added';
            // $scope.showSuccessAlert = true;
            // resetForm();
          }, (e) => {
            console.warn(e);
            // window.alert('Creating the post failed.');
            // resetForm();
            // $scope.failTextAlert = 'Creating the project failed.';
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

        this.resetForm = function () {
          this.project = angular.copy(EMPTY_PROJECT);
          this.form = angular.copy(EMPTY_FORM);
          this.form.campusCheckboxes = angular.copy(campuses);
          this.form.categoryCheckboxes = angular.copy(categories);
          this.form.disciplineCheckboxes = angular.copy(disciplines);
        };

        const getCampuses = () => {
          const api = new Api('/campuses');
          api.get().then((response) => {
            campuses = response.data;

            // add campus info to the form for checkboxes
            this.form.campusCheckboxes = angular.copy(campuses);
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
          }, (e) => {
            console.warn(e);
            disciplines = [];
          });
        };

        getCampuses();
        getCategories();
        getDisciplines();
      },
    ],
  });
