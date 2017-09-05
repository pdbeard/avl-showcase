angular
  .module('projectEdit')
  .component('projectEdit', {
    templateUrl: 'project-edit/project-edit.template.html',
    controller: ['Api', 'apiHost', 'Authentication', '$q', '$routeParams', '$location',
      function ProjectEditController(Api, apiHost, Authentication, $q, $routeParams, $location) {
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
        this.apiHost = apiHost;

        this.goToProjects = () => $location.url('/projects');

        this.updateSelect = (selectObject) => {
          switch (selectObject.field) {
            case 'campus':
              this.project.campus_ids = selectObject.values;
              break;
            case 'category':
              this.project.category_ids = selectObject.values;
              break;
            case 'discipline':
              this.project.discipline_ids = selectObject.values;
              break;
            default:
              console.log('unrecognized selectObject.field');
          }
        };

        this.updateTags = (tagsArray) => {
          this.project.tags = tagsArray;
        };

        const getCampuses = () => {
          const api = new Api('/campuses');
          api.get().then((response) => {
            campuses = response.data;

            // add campus info to the form for checkboxes
            this.form.campusCheckboxes = angular.copy(campuses);

            // check boxes that belong to this project
            this.project.campus_ids.forEach((campusId) => {
              this.form.campusCheckboxes.find(campus => campus.id === campusId).selected = true;
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
              this.form.categoryCheckboxes.find(category => category.id === categoryId).selected = true;
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
              this.form.disciplineCheckboxes.find(discipline => discipline.id === disciplineId).selected = true;
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

          console.log("3.A");
          const api = new Api(`/project/${self.project.id}/edit`);

          // convert people objects into strings
          self.form.peopleStrings = self.form.peopleObjects.map(person => `${person.name_first}--${person.name_last}`);

          // convert people strings into single string
          self.project.people = self.form.peopleStrings.join(';');

          api.put(self.project).then((response) => {

            console.log("3.B");
            self.message_style = "alert success one-third float-center";
            self.info_message  = "Post has been successfully edited";
            console.warn(response);
          }, (e) => {
            // console.log('edit failed');

            console.log("3.C");
            console.warn(e);
            self.message_style = "alert error one-third float-center";
            self.info_message  = "Editing the post failed. " + e.data.error;


            // window.alert('Editing the post failed.');
            // self.resetForm();
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
            //   d.reject(response);
            //   console.log("1.A");
            // } else {
              d.reject(response);
              console.log("1.B :" );
            }
          });
          return d.promise;
        };

        // create new project
        this.submitForm = function () {
          if (this.form.imageData) {
            uploadBlob(this.form.imageData).then((response) => {
              this.project.image_ref = response.data.digest;

              console.log("2.A");
              submitProject();
            }, (e) => {
              console.log("2.B");
              console.warn(e);
              self.message_style = "alert error one-third float-center";
              self.info_message  = "Editing the post failed. " + e.data.error;
              // window.alert('Image upload failed.');
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
