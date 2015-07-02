(function() {
  'use strict';

  angular.module('branch2.login')
  .controller('LoginCtrl', function($state) {

    // Form data for the login modal
    this.loginData = {};

    this.login = function() { // temporarily sending to other screens via login button: ss
      // TODO (Erik Hellenbrand) : Log the user in
      $state.go("app.selectAssessment")
    };

  });

})();