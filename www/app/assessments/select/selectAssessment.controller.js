(function() {
  'use strict';

  angular.module('branch2.assessments')
  .controller('SelectAssessmentCtrl', function($scope, $state, $ionicSideMenuDelegate, Assessments) {
    var self = this;
  	this.availableAssessments = [];

    // This event is fired every time we enter the select assessment view.  Ionic will cache 10 views by default, so performing these actions on controller creation wouldn't always make sense.
    $scope.$on("$ionicView.beforeEnter", function() {
      // Retrieve the assessments available to be taken from the Assessments service.
      $ionicSideMenuDelegate.canDragContent(true);  // Ensure this is enabled: assessment question view will disable this.

      Assessments.getAvailableAssessments().then(function(result) {
        self.availableAssessments = result;
      }, function(error) {
        console.log(error);
      });
    });

  	this.selectAssessment = function(assessment) {
      Assessments.loadAssessment(assessment.id).then(function() {
        $state.go('app.assessment',{AssessmentId: assessment.id, QuestionId: assessment.firstQuestionID});
      });
  	};
  });

})();