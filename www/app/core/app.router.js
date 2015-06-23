(function() {
  'use strict';

  angular.module('branch2')


  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('splash', {
      url: '/',
      templateUrl: 'app/splash/splash.html',
      // controller: 'SplashCtrl'
    })

    .state('login', {
      url: '/login',
      templateUrl: 'app/login/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'login'
    })

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "app/core/menu.html",
      controller: 'AppCtrl',
      controllerAs: 'app'
    })

      // .state('app.playlists', {
      //   url: "/playlists",
      //   views: {
      //     'menuContent': {
      //       templateUrl: "templates/playlists.html",
      //       controller: 'PlaylistsCtrl'
      //     }
      //   }
      // })


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
  });


})();