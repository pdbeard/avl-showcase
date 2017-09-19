/* eslint no-param-reassign: "off" */
angular
  .module('loginButton')
  .component('loginButton', {
    templateUrl: 'login-button/login-button.template.html',
    controller: ['Authentication', '$window', '$location', '$http', 'Api', function LoginButtonController(Authentication, $window, $location, $http, Api) {
      const self = this;
      this.authentication = Authentication;
      this.username = '';

      this.authenticateAsAdmin = function authenticateAsAdmin() {
        if (!this.authentication.isAdmin) {
          const cas = 'https://cas.iu.edu/cas/login?cassvc=IU&casurl=';
          $window.location.assign(`${cas}${$location.absUrl()}`);
        }
      };

      this.goToProjectCreate = function goToProjectCreate() {
        $location.url('/project-create');
      };

      const checkForCasTicket = function checkForCasTicket() {
        if ($window.location.search) {
          const casTicket = $window.location.search.substring('?casticket='.length);
          const urlWithoutCasTicket = $location.absUrl().replace($window.location.search, '');

          const api = new Api('/cas');
          const data = {
            ticket: casTicket,
            url: urlWithoutCasTicket,
          };
          api.post(data).then((response) => {
            const authorizedUsers = [
              'mjboyles',
              'jlrogers',
              'ceeller',
              'shermanw',
              'dambik',
              'dmreagan',
              'cfrend',
              'pdbeard',
              'tyjajack',
              'ewernert',
            ];

            if (authorizedUsers.includes(response.data)) {
              self.authentication.isAdmin = true;
              self.username = response.data;
            } else {
              // valid IU credentials, but not on AVL list
              // need to show error alert
            }
          }, (error) => {
            console.warn(error);
          });
        }
      };

      if (!this.authentication.isAdmin) checkForCasTicket();
    }],
  });
