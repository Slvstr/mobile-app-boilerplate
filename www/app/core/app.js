(function() {
  'use strict';

  /******************************************************************************
   * Main App Module Definition & Run Block
   *****************************************************************************/
  angular.module('branch2', [
    'ionic',
    'ngCordova',
    'branch2.login',
    'branch2.signup',
    'branch2.audio'
  ])

  // CHANCE THIS FOR EACH CUSTOMER
  .constant('Community', 'demoCommunity')


  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  });

})();