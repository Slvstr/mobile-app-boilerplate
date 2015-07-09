(function() {
  'use strict';

  angular.module('branch2.assessments')
  .controller('EndAssessmentCtrl', function(Assessments, $ionicSideMenuDelegate, $scope, $state) {
    var self = this;
  	this.scores = [];
    this.scoresHidden = true;

    // This event is fired every time we enter the select assessment view.  Ionic will cache 10 views by default, so performing these actions on controller creation wouldn't always make sense.
    $scope.$on("$ionicView.beforeEnter", function() {
      // Retrieve the assessments available to be taken from the Assessments service.
      $ionicSideMenuDelegate.canDragContent(false);  // Ensure this is enabled: assessment question view will disable this.

      self.scores = Assessments.getScores();

      if (self.scores !== undefined) {
        self.scoresHidden = false;
      }
    });

  	this.returnToSelectAssessment = function() {
      $state.go('app.selectAssessment');
  	};
  });

})();