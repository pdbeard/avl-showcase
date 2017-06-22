angular
  .module('apiUrl')
  .service('apiUrl', function () {
    return function (path) {
      return `http://localhost:8080${path}`;
    };
  });
  // .service('apiUrl', function (apiHost) {
  //   return function (path) {
  //     return apiHost + path;
  //   };
  // });
