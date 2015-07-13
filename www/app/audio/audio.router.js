(function() {
  'use strict';

  angular.module('branch2.audio')
  .config(function($stateProvider) {

    $stateProvider

    // .state('app.audio', {
    //   url: '/audio',
    //   abstract: true
    // })

    .state('app.library', {
      url: '/library',
      views: {
        menuContent: {
          templateUrl: 'app/audio/library/library.html',
          controller: 'AudioLibraryCtrl as library'
        }
      }
    })

    .state('app.player', {
      url: '/player',
      views: {
        menuContent: {
          templateUrl: 'app/audio/player/player.html',
          controller: 'AudioPlayerCtrl as player'
        }
      }
    });

  });

})();