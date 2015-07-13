(function() {
  'use strict';

  angular.module('branch2.audio')


  .controller('AudioLibraryCtrl', function(Audio, $state) {
    var library = this;

    Audio.getTracks().then(function(tracks) {
      library.tracks = tracks;
    });

    library.playTrack = function(track) {
      Audio.setCurrentTrack(track);
      $state.go('app.player');
    };

  });

})();