// angular
//   .module('api')
//   .service('Api', (apiUrl, $q, $http) => function (path) {
//     const url = apiUrl(path);
//     this.post = function (data) {
//       // CREATE
//       return $http.post(url, JSON.stringify(data));
//     };
//     this.get = function () {
//       // RETRIEVE
//       return $http.get(url);
//     };
//     this.put = function (data) {
//       // UPDATE
//       return $http.put(url, JSON.stringify(data));
//     };
//     this.delete = function () {
//       // DELETE
//       return $http.delete(url);
//     };
//   });
angular
  .module('api')
  .service('Api', function ($q, $http) {
    return function (path) {
      // const url = apiUrl(path);
      const url = `http://localhost:8080${path}`;
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
    };
  });
