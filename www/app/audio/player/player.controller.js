(function() {
  'use strict';

  angular.module('branch2.audio')
  .controller('AudioPlayerCtrl', function(Audio, $cordovaMedia, $ionicLoading, $timeout) {

    var player = this;
    var media;
    player.isPlaying = false;
    player.togglePlayback = togglePlayback
    $ionicLoading.show({template: '<i class="icon ion-load-d loading"></i>'});
    

    // Using $timeout here so the view will load immediately.  Without it 
    // the app would hang on the library view until the media was ready to play
    $timeout(function() {
      loadTrack();
    }, 50);


    function loadTrack() {;

      player.track = Audio.getCurrentTrack();
      media = new Media(player.track.url, null, null, mediaStatusCallback);
      player.track.duration = media.getDuration() > 0 ? media.getDuration() : '';

      togglePlayback();
    }

    function mediaStatusCallback(status) {
      console.log('status: ' + status);
      if (status === 2) {
        $ionicLoading.hide();
      }
    }

    function togglePlayback() {

      if (player.isPlaying) {
        media.pause();
      } else {
        media.play();
      }

      player.isPlaying = !player.isPlaying;
    }


    // TODO (Erik Hellenbrand) : Need to call media.release() to release
    // device audio resources when the user leaves the view?


  });

})();