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
  .controller('GuestbookController', function ($scope, $q, apiHost, Api, Location, objectArrayIndexOf) {
    const EMPTY = {
      user: {
        name: null,
        location: null,
      },
      text: null,
      image_ref: null,
      campus_checkbox: [],
    };
    // const locationCache = null;
    const SEARCH_API = new Api('/search');

    $scope.posts = [];
    $scope.campuses = [];
    $scope.projects = [];
    $scope.imagedata = null;
    $scope.formdata = angular.copy(EMPTY);
    $scope.apiHost = apiHost;
    $scope.search = {
      query_string: '',
    };

    const addCampusNamesToProject = function (project) {
      const projectWithCampusNames = project;

      if (project.campus_ids) {
        const campusIndices = project.campus_ids.map(id =>
          objectArrayIndexOf($scope.campuses, 'id', id));

        projectWithCampusNames.campus_names = campusIndices.map(
          index => $scope.campuses[index].name);
      }

      return projectWithCampusNames;
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
        $scope.formdata.campus_checkbox = angular.copy($scope.campuses);
      }, (e) => {
        console.warn(e);
        $scope.campuses = [];
      });
    };

    const loadProjects = function () {
      const api = new Api('/projects');
      api.get().then((response) => {
        $scope.projects = response.data;

        const projectsWithCampusNames = $scope.projects.map(addCampusNamesToProject);
        $scope.projects = projectsWithCampusNames;
        $scope.projects = $scope.projects.map((project) => {
          const projectWithCampuses = angular.copy(project);
          projectWithCampuses.campuses = angular.copy($scope.campuses);

          projectWithCampuses.campuses.forEach((campus) => {
            if (project.campus_ids && project.campus_ids.find(id => id === campus.id)) {
              campus.checked = true;
            }
          });

          return projectWithCampuses;
        });
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

      // load existing projects
      loadProjects();
    };

    // reset input form but refill location from cache
    const resetForm = function () {
      $scope.formdata = angular.copy(EMPTY);
      $scope.formdata.campus_checkbox = angular.copy($scope.campuses);
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
      $scope.formdata.campus_ids = [];
      $scope.formdata.campus_checkbox.forEach((checkbox) => {
        if (checkbox.checked) {
          $scope.formdata.campus_ids.push(checkbox.id);
        }
      });

      api.post($scope.formdata).then((response) => {
        const projects = response.data;
        for (let i = 0; i < projects.length; i += 1) {
          $scope.projects.unshift(projects[0]);
        }
        resetForm();
      }, (e) => {
        console.warn(e);
        window.alert('Creating the post failed.');
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
        if ($scope.projects.length > 0) {
          const projectsWithCampusNames = $scope.projects.map(addCampusNamesToProject);
          $scope.projects = projectsWithCampusNames;
          $scope.projects = $scope.projects.map((project) => {
            const projectWithCampuses = angular.copy(project);
            projectWithCampuses.campuses = angular.copy($scope.campuses);

            projectWithCampuses.campuses.forEach((campus) => {
              if (project.campus_ids && project.campus_ids.find(id => id === campus.id)) {
                campus.checked = true;
              }
            });

            return projectWithCampuses;
          });
        }
      }, (e) => {
        console.warn(e);
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


    // create new post
    this.submitForm = function () {
//      if (!$scope.formdata.user.location) return;
      if ($scope.imagedata) {
        uploadBlob($scope.imagedata).then((response) => {
          $scope.formdata.image_ref = response.data.digest;
//          submitPost();
          submitProject();
        }, (e) => {
          console.warn(e);
          window.alert('Image upload failed.');
        });
      } else {
//        submitPost();
        submitProject();
      }
    };

    // like an existing post
    this.likePost = function (post) {
      const api = new Api(`/post/${post.id}/like`);
      api.put().then((response) => {
        post.like_count = response.data.like_count;
      }, (e) => {
        console.warn(e);
        window.alert('Liking the post failed.');
      });
    };

    // edit existing post
    this.editPost = function (project) {
      const api = new Api(`/project/${project.id}/edit`);

      project.campus_ids = [];

      project.campuses.forEach((campus) => {
        if (campus.checked) {
          project.campus_ids.push(campus.id);
        }
      });
      api.put(project).then((response) => {
        resetForm();
      }, (e) => {
        console.warn(e);
        window.alert('Editing the post failed.');
      });
    };


    // delete existing post
    this.deletePost = function (project) {
      const idx = objectArrayIndexOf($scope.projects, 'id', project.id);
      const api = new Api(`/projects/${project.id}`);
      api.delete().then((response) => {
        $scope.projects.splice(idx, 1);
      }, (e) => {
        console.warn(e);
        window.alert('Deleting the post failed.');
      });
    };

    // clear search form
    this.clearSearch = function () {
      $scope.search = {
        query_string: '',
      };
    };

    // initialize controller
    init();
  });
