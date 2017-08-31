angular
  .module('projectCreate')
  .component('projectCreate', {
    templateUrl: 'project-create/project-create.template.html',
    controller: ['Api', 'Authentication', '$q', '$routeParams','$location',
      function ProjectCreateController(Api, Authentication, $q, $routeParams, $location) {
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
        console.log(this.projectId);
        this.project = angular.copy(EMPTY_PROJECT);
        this.form = angular.copy(EMPTY_FORM);
        this.authentication = Authentication;

        this.goToProjects = () => $location.url('/projects');

        if (this.projectId){
          this.goToCreated = () => $location.url(`/projects/${this.projectId}`);
          this.message_success = "alert success one-third float-center";
          this.message_content = "Project created!"
          console.log(true);
        }

        this.updateSelect = (selectObject) => {
          // console.log('create update...');
          // console.log(selectObject);
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
            case 'reset':
              // console.log("reset initiated");
              this.project.campus_ids = selectObject.values;
              this.project.category_ids = selectObject.values;
              this.project.discipline_ids = selectObject.values;
              break;
            default:
              // console.log('unrecognized selectObject.field');
          }
          // console.log(this.project.discipline_ids);
        };

        this.updateTags = (tagsArray) => {
          this.project.tags = tagsArray;
        };

        const submitProject = function submitProject() {
          const api = new Api('/projects');

          // convert people objects into strings
          self.form.peopleStrings = self.form.peopleObjects.map(person => `${person.name_first}--${person.name_last}`);

          // convert people strings into single string
          self.project.people = self.form.peopleStrings.join(';');

          api.post(self.project).then((response) => {

          
            // self.message_style = "alert success one-third float-center";
            // self.info_message = response.data.success;
            // self.new_id = response.data.id;
            $location.url(`/project-create/${response.data.id}`);
            // console.warn(response);
            // self.resetForm();

          }, (e) => {
            console.warn(e);

            self.message_style = "alert error one-third float-center";
            self.info_message = e.data.error;
            self.projectId = undefined; 

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
          // this.form.campusCheckboxes = angular.copy(campuses);
          // this.form.categoryCheckboxes = angular.copy(categories);
          // this.form.disciplineCheckboxes = angular.copy(disciplines);
          // console.log(this.form.campusCheckboxes);
          const reset = {
                field:"reset",
                values: []
          }

          self.updateSelect(reset);
          self.updateTags();
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
