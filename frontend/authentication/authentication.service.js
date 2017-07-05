angular
  .module('authentication')
  .service('Authentication', function () {
    let authenticated = false;
    this.isAdmin = () => authenticated;
    // this.isAdmin = authenticated;
    this.authenticateAsAdmin = function authenticateAsAdmin() {
      authenticated = true;
      // this.isAdmin = true;
      console.log('authenticated as admin');
    };
  });
