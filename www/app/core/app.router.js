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
      controller: 'LoginCtrl as login',
    })

    .state('signup', {
      url: '/signup',
      templateUrl: 'app/signup/signup.html',
      controller: 'SignupCtrl',
      controllerAs: 'signup'
    })

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "app/core/menu.html",
      controller: 'AppCtrl as app',
      //controllerAs: 'app'
    })

    .state('app.selectAssessment', {
      url: "/select-assessment",
      views: {
        'menuContent': {
          templateUrl: 'app/assessments/select/selectAssessment.html',
          controller: 'SelectAssessmentCtrl as selectassessment'
        }
      }
    })

    .state('app.assessment', {
      url: "/assessment/:AssessmentId/:QuestionId",
      views: {
        'menuContent': {
          templateUrl: 'app/assessments/questions/assessmentQuestions.html',
          controller: 'AssessmentsCtrl as assessments'
        }
      }
    })

    .state('app.endAssessment', {
      url: "/assessment-results",
      views: {
        'menuContent': {
          templateUrl: 'app/assessments/end/endAssessment.html',
          controller: 'EndAssessmentCtrl as endassessment'
        }
      }
    });

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