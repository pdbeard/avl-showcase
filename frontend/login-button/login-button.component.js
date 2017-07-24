/* eslint no-param-reassign: "off" */
angular
  .module('loginButton')
  .component('loginButton', {
    templateUrl: 'login-button/login-button.template.html',
    controller: ['Authentication', '$window', '$location', '$http', '$scope', function LoginButtonController(Authentication, $window, $location, $http, $scope) {
      const self = this;
      this.authentication = Authentication;
      this.authenticateAsAdmin = function authenticateAsAdmin() {
        if (!this.authentication.isAdmin) {
          const host = $window.location.host;
          const hash = $window.location.hash;
          const cas = 'https://cas.iu.edu/cas/login?cassvc=IU&casurl=';
          $window.location.assign(`${cas}http://${host}/${hash}`);
        }
      };

      this.goToProjectCreate = function goToProjectCreate() {
        $location.url('/project-create');
      };

      const checkForCasTicket = function checkForCasTicket() {
        if ($window.location.search) {
          const casTicket = $window.location.search.substring('?casticket='.length);
          const prefix = 'https://cas.iu.edu/cas/validate?cassvc=IU&casticket=';
          const postfix = '&casurl=http://156.56.179.201:3000';

          // validate CAS ticket
          // can't do this on dev server because of CORS errors
          // $http.get(`${prefix}${casTicket}${postfix}`).then(function (response) {
          //   // If validation is successful, CAS sends back a two-line response
          //   // with "yes" on the first and "username" on the second. If validation fails,
          //   // CAS simply responds with "no".
          // });

          // assume valid ticket because of above error
          self.authentication.isAdmin = true;
        }
      };

      if (!this.authentication.isAdmin) checkForCasTicket();
    }],
  });
