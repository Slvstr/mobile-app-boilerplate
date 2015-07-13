(function() {
  'use strict';

  angular.module('branch2.audio')
  .factory('Audio', function($http, $q, Community) {
    var currentTrack;
    // var endpoint = 'http://api.branch2.com/audio/' + Community;
    var endpoint = 'http://localhost:3030/audio/' + Community

    return {
      getTracks: function() {

        return $http.get(endpoint).then(function(response) {
          console.dir(response);
          return response.data.map(function(track) {
            return angular.fromJson(track);
          });
        });

      },

      getCurrentTrack: function() {
        return currentTrack;
      },

      setCurrentTrack: function(track) {
         currentTrack = track;
      }
    };
  });

})();