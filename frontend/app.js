angular.module('app', [])
  .value('apiHost', 'http://localhost:8080')
  .service('apiUrl', (apiHost) => function (path) {
    return apiHost + path;
  })
  .service('Api', (apiUrl, $q, $http) => function (path) {
    const url = apiUrl(path);
    this.post = function (data) {
        // CREATE
      return $http.post(url, JSON.stringify(data));
    };
    this.get = function () {
        // RETRIEVE
      return $http.get(url);
    };
    this.put = function (data) {
        // UPDATE
      return $http.put(url, JSON.stringify(data));
    };
    this.delete = function () {
        // DELETE
      return $http.delete(url);
    };
//    this.edit = function () {
//        // DELETE
//      return $http.edit(url);
//    };
  })
  .service('Location', ($q) => {
    const getLocation = function (success, error) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success);
      } else {
        error(new Error('Your browser does not support HTML5 location.'));
      }
    };
    return function () {
      this.get = function () {
        const d = $q.defer();
        getLocation((position) => {
          d.resolve(position);
        }, (e) => {
          d.reject(e);
        });
        return d.promise;
      };
    };
  })
  .service('objectArrayIndexOf', () => function (arr, k, v) {
    // usage: objectArrayIndexOf([{id:2},{id:1},{id:3}], 'id', 1) -> 1
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i][k] === v) return i;
    }
    return -1;
  })
  .directive('blob', () => ({
    scope: {
      blob: '=',
    },
    link($scope, elem, attr) {
      elem.bind('change', (changeEvent) => {
        const reader = new FileReader();
        reader.onload = function (loadEvent) {
          $scope.$apply(() => {
            $scope.blob = loadEvent.target.result;
          });
        };
        reader.readAsBinaryString(changeEvent.target.files[0]);
      });
    },
  }))
  .filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
  })
  .controller('GuestbookController', function ($scope, $q, apiHost, Api, Location, objectArrayIndexOf) {




    this.isAuthorized = {admin:false}
    $scope.successTextAlert ="That seemed to work!";
    $scope.showSuccessAlert = false;
    $scope.failTextAlert ="Something went wrong!";
    $scope.showFailAlert = false;
    $scope.showDetails =false;


    $scope.currentPage = 0;
    $scope.pageSize = 8;
    // $scope.projects = [];
    $scope.numberOfPages=function(){
        return Math.ceil($scope.projects.length/$scope.pageSize);                
    }


    const EMPTY = {
      user: {
        name: null,
        location: null,
      },
      text: null,
      image_ref: null,
      campus_checkbox: [],
      category_checkbox: [],
      discipline_checkbox: [],
      tags: '',
      peopleObjects: [],
    };
    // const locationCache = null;
    const SEARCH_API = new Api('/search');

    $scope.posts = [];
    $scope.campuses = [];
    $scope.categories = [];
    $scope.disciplines = [];
    $scope.projects = [];
    $scope.imagedata = null;
    $scope.formdata = angular.copy(EMPTY);
    $scope.apiHost = apiHost;
    $scope.search = {
      query_string: '',
    };

    /**
     * Add stuff to each project to facilitate checkboxes, ng-repeats, etc
     */
    const addStuffToProjects = () => {
      $scope.projects = $scope.projects.map((project) => {
        // add campuses, categories, and disciplines arrays to project
        const newProject = angular.copy(project);
        newProject.campuses = angular.copy($scope.campuses);
        newProject.categories = angular.copy($scope.categories);
        newProject.disciplines = angular.copy($scope.disciplines);

        // convert tags array to string
        newProject.tagsString = newProject.tags.join();

        // convert people string to string array
        newProject.peopleStrings = newProject.people.split(';');

        // convert people string array to object array
        newProject.peopleObjects = newProject.peopleStrings.map((person) => {
          const splitPerson = person.split('--');

          return {
            name_first: splitPerson[0],
            name_last: splitPerson[1],
          };
        });

        // set checked = true if the campus is in the campus_ids array
        newProject.campuses = newProject.campuses.map((campus) => {
          const campusWithChecked = angular.copy(campus);
          if (project.campus_ids &&
              project.campus_ids.find(id => id === campusWithChecked.id)) {
            campusWithChecked.checked = true;
          }

          return campusWithChecked;
        });

        // set checked = true if the category is in the category_ids array
        newProject.categories = newProject.categories.map((category) => {
          const categoryWithChecked = angular.copy(category);
          if (project.category_ids &&
              project.category_ids.find(id => id === categoryWithChecked.id)) {
            categoryWithChecked.checked = true;
          }

          return categoryWithChecked;
        });

        // set checked = true if the discipline is in the discipline_ids array
        newProject.disciplines = newProject.disciplines.map((discipline) => {
          const disciplineWithChecked = angular.copy(discipline);
          if (project.discipline_ids &&
              project.discipline_ids.find(id => id === disciplineWithChecked.id)) {
            disciplineWithChecked.checked = true;
          }

          return disciplineWithChecked;
        });

        // add campus names to projects
        // need this to list names in template
        if (newProject.campus_ids) {
          // get the index of each campus in the campuses array
          const campusIndices = newProject.campus_ids.map(id =>
            objectArrayIndexOf($scope.campuses, 'id', id));

          // get the name of each project
          newProject.campus_names = campusIndices.map(
            index => $scope.campuses[index].name);
        }

        // add category names to projects
        // need this to list names in template
        if (newProject.category_ids) {
          // get the index of each category in the categoryes array
          const categoryIndices = newProject.category_ids.map(id =>
            objectArrayIndexOf($scope.categories, 'id', id));

          // get the name of each project
          newProject.category_names = categoryIndices.map(
            index => $scope.categories[index].name);
        }

        // add category names to projects
        // need this to list names in template
        if (newProject.discipline_ids) {
          // get the index of each discipline in the disciplines array
          const disciplineIndices = newProject.discipline_ids.map(id =>
            objectArrayIndexOf($scope.disciplines, 'id', id));

          // get the name of each project
          newProject.discipline_names = disciplineIndices.map(
            index => $scope.disciplines[index].name);
        }

        return newProject;
      });
    };

    // const loadPosts = function () {
    //   const api = new Api('/posts');
    //   api.get().then((response) => {
    //     $scope.posts = response.data;
    //   }, (e) => {
    //     console.warn(e);
    //     $scope.posts = [];
    //   });
    // };

    const loadCampuses = function () {
      const api = new Api('/campuses');
      api.get().then((response) => {
        $scope.campuses = response.data;

        // add campus info to the form for checkboxes
        $scope.formdata.campus_checkbox = angular.copy($scope.campuses);
      }, (e) => {
        console.warn(e);
        $scope.campuses = [];

        // $scope.failTextAlert ="error";
        // $scope.showFailAlert = true;
      });
    };

    const loadCategories = function () {
      const api = new Api('/categories');
      api.get().then((response) => {
        $scope.categories = response.data;

        // add campus info to the form for checkboxes
        $scope.formdata.category_checkbox = angular.copy($scope.categories);
      }, (e) => {
        console.warn(e);
        $scope.categories = [];
      });
    };

    const loadDisciplines = function () {
      const api = new Api('/disciplines');
      api.get().then((response) => {
        $scope.disciplines = response.data;

        // add campus info to the form for checkboxes
        $scope.formdata.discipline_checkbox = angular.copy($scope.disciplines);
      }, (e) => {
        console.warn(e);
        $scope.disciplines = [];
      });
    };

    const loadProjects = function () {
      const api = new Api('/projects');
      api.get().then((response) => {
        $scope.projects = response.data;
        addStuffToProjects();
      }, (e) => {
        console.warn(e);
        $scope.projects = [];
      });
    };

    const init = function () {
      // // try to get location from browser
      // var location = new Location();
      // location.get().then(function(pos) {
      //   locationCache = [pos.coords.longitude, pos.coords.latitude];
      //   $scope.formdata.user.location = angular.copy(locationCache);
      // }, function(e) {
      //   console.warn(e);
      //   window.alert(e.message);
      // });
      // load existing posts
      // loadPosts();

      // load campus lookup table
      loadCampuses();

      // load category lookup table
      loadCategories();

      // load discipline lookup table
      loadDisciplines();

      // load existing projects
      loadProjects();
    };

    // reset input form but refill location from cache
    const resetForm = function () {
      $scope.formdata = angular.copy(EMPTY);
      $scope.formdata.campus_checkbox = angular.copy($scope.campuses);
      $scope.formdata.category_checkbox = angular.copy($scope.categories);
      $scope.formdata.discipline_checkbox = angular.copy($scope.disciplines);
//      $scope.formdata.user.location = angular.copy(locationCache);

      $scope.imagedata = null;
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

//    const submitPost = function () {
//      const api = new Api('/posts');
//      api.post($scope.formdata).then((response) => {
//        const posts = response.data;
//        for (let i = 0; i < posts.length; i += 1) {
//          $scope.posts.unshift(posts[0]);
//        }
//        resetForm();
//      }, (e) => {
//        console.warn(e);
//        window.alert('Creating the post failed.');
//      });
//    };

    const submitProject = function () {
      const api = new Api('/projects');

      // convert people objects into strings
      $scope.formdata.people = $scope.formdata.peopleObjects.map(person => `${person.name_first}--${person.name_last}`);

      // convert people strings into single string
      $scope.formdata.people = $scope.formdata.people.join(';');

      // convert tags string into array
      $scope.formdata.tags = $scope.formdata.tags.split(/\s*,\s*/);

      // add campuses to campus_ids if checked
      $scope.formdata.campus_ids = [];
      $scope.formdata.campus_checkbox.forEach((checkbox) => {
        if (checkbox.checked) {
          $scope.formdata.campus_ids.push(checkbox.id);
        }
      });

      // add categories to category_ids if checked
      $scope.formdata.category_ids = [];
      $scope.formdata.category_checkbox.forEach((checkbox) => {
        if (checkbox.checked) {
          $scope.formdata.category_ids.push(checkbox.id);
        }
      });

      // add disciplines to discipline_ids if checked
      $scope.formdata.discipline_ids = [];
      $scope.formdata.discipline_checkbox.forEach((checkbox) => {
        if (checkbox.checked) {
          $scope.formdata.discipline_ids.push(checkbox.id);
        }
      });

      api.post($scope.formdata).then((response) => {
        const projects = response.data;
        for (let i = 0; i < projects.length; i += 1) {
          $scope.projects.unshift(projects[0]);
        }
        $scope.successTextAlert ="Project added";
        resetForm();

        $scope.showSuccessAlert = true;
      }, (e) => {
        // console.warn(e);
        // window.alert('Creating the post failed.');

        $scope.failTextAlert ="Creating the project failed.";
        $scope.showFailAlert = true;
        resetForm();

      });
    };

    // var searchPosts = function() {
    //   SEARCH_API.post($scope.search).then(function(response) {
    //     $scope.posts = response.data;
    //   }, function(e) {
    //     console.warn(e);
    //     $scope.posts = [];
    //   });
    // };

    const searchProjects = function () {
      SEARCH_API.post($scope.search).then((response) => {
        $scope.projects = response.data;
        $scope.currentPage = 0;
        if ($scope.projects.length > 0) {
          addStuffToProjects();
        }
      }, (e) => {
        console.warn(e);
        $scope.failTextAlert ="Creating the project failed.";
        $scope.showFailAlert = true;

        $scope.projects = [];
      });
    };

    // watch search input
    $scope.$watch(scope => scope.search.query_string, (newVal, oldVal) => {
      if (newVal === '') {
        // loadPosts();
        loadProjects();
      } else if (newVal !== oldVal) {
        // searchPosts();
        searchProjects();
      }
    });


    // create new project
    this.submitForm = function () {
      if ($scope.imagedata) {
        uploadBlob($scope.imagedata).then((response) => {
          $scope.formdata.image_ref = response.data.digest;
          submitProject();
        }, (e) => {
          console.warn(e);
          window.alert('Image upload failed.');
        });
      } else {
        submitProject();
      }
    };

    // like an existing post
    // this.likePost = function (post) {
    //   const api = new Api(`/post/${post.id}/like`);
    //   api.put().then((response) => {
    //     post.like_count = response.data.like_count;
    //   }, (e) => {
    //     console.warn(e);
    //     window.alert('Liking the post failed.');
    //   });
    // };

    // edit existing post
    const editProject = function (project) {
      const api = new Api(`/project/${project.id}/edit`);
      const editedProject = angular.copy(project);

      // convert people objects into strings
      editedProject.people = editedProject.peopleObjects.map(person => `${person.name_first}--${person.name_last}`);

      // convert people strings into single string
      editedProject.people = editedProject.people.join(';');

      // convert tags string into array
      editedProject.tags = editedProject.tagsString.split(/\s*,\s*/);

      // add campuses to campus_ids if checked
      editedProject.campus_ids = [];
      editedProject.campuses.forEach((campus) => {
        if (campus.checked) {
          editedProject.campus_ids.push(campus.id);
        }
      });

      // add categories to category_ids if checked
      editedProject.category_ids = [];
      editedProject.categories.forEach((category) => {
        if (category.checked) {
          editedProject.category_ids.push(category.id);
        }
      });

      // add disciplines to discipline_ids if checked
      editedProject.discipline_ids = [];
      editedProject.disciplines.forEach((discipline) => {
        if (discipline.checked) {
          editedProject.discipline_ids.push(discipline.id);
        }
      });

      api.put(editedProject).then((response) => {
        $scope.successTextAlert ="Project edited";
        resetForm();

        $scope.showSuccessAlert = true; 
      }, (e) => {
        // console.warn(e);
        // window.alert('Editing the post failed.');
        $scope.failTextAlert ="Editing the post failed. ";
        $scope.showFailAlert = true;
        resetForm();
      });
    };


    // edit project
    this.submitEditForm = function (project) {
      if (project.imagedata) {
        const projectWithNewImage = angular.copy(project);
        uploadBlob(project.imagedata).then((response) => {
          projectWithNewImage.image_ref = response.data.digest;
          editProject(projectWithNewImage);
        }, (e) => {
          console.warn(e);
          window.alert('Image upload failed.');
        });
      } else {
        editProject(project);
      }
    };

    // delete existing post
    this.deletePost = function (project) {
      const idx = objectArrayIndexOf($scope.projects, 'id', project.id);
      const api = new Api(`/projects/${project.id}`);
      api.delete().then((response) => {
        $scope.successTextAlert ="Project Deleted!";
        $scope.showSuccessAlert =true;
        $scope.projects.splice(idx, 1);
      }, (e) => {
        // console.warn(e);
        // window.alert('Deleting the post failed.');
        $scope.failTextAlert ="Deleting the projected failed.";
        $scope.showFailAlert = true;
      });
    };

    // clear search form
    this.clearSearch = function () {
      $scope.search = {
        query_string: '',
      };
    $scope.currentPage = 0;
    };

    // initialize controller
    init();
  });


  
