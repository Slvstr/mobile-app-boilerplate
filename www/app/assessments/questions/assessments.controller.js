(function() {
  'use strict';

  angular.module('branch2.assessments')
  .controller('AssessmentsCtrl', function($scope, $stateParams, $state, $ionicSideMenuDelegate, Assessments) {
    self = this;

    $ionicSideMenuDelegate.canDragContent(false);

  	var selectedAssessmentID = $stateParams.AssessmentId;
    var selectedQuestionID = $stateParams.QuestionId;

  	this.prompt = "";
  	this.questionResponses = [];

    // This event is fired every time we enter the select assessment view.  Ionic will cache 10 views by default, so performing these actions on controller creation wouldn't always make sense.
    //$scope.$on("$ionicView.enter", function() {
      $ionicSideMenuDelegate.canDragContent(false);

      // Retrieve the information for this question, and set that information to be displayed.
      Assessments.getQuestionInformationGivenID(selectedQuestionID).then(function(result) {
        self.prompt = result.prompt;
        self.questionResponses = result.responses;
        self.format = result.format;
        self.progress = result.assessmentProgress*100;
        self.answer = result.answer;
      }, function (error) {
        console.log(error);
      });
    //});

    // Request to advance to the next question from the service.  If a next question exists, transition to that view.
    this.advanceNextQuestion = function() {
      var nextQuestionID = Assessments.goNextQuestion();
      if (nextQuestionID !== undefined ) {
        $state.go('app.assessment',{AssessmentId: selectedAssessmentID, QuestionId: nextQuestionID});
      }
    };

    // Request to return to the last question from the service.  If a previous question exists, transition to that view.
    this.returnPreviousQuestion = function() {
      var lastQuestionID = Assessments.goLastQuestion();

      if (lastQuestionID !== undefined ) {
        $state.go('app.assessment',{AssessmentId: selectedAssessmentID, QuestionId: lastQuestionID});
      }
    };

    // Send our answer to the assessment service.
    // If we've completed the assessment, direct back to the selection page.  Otherwise, transition to the next question screen.
    this.recordAnswer = function() {
      var assessmentCompleted = Assessments.submitAnswer(self.answer, selectedAssessmentID, selectedQuestionID);
      if (assessmentCompleted) {
        self.submitAssessment();
      }
      else {
        self.advanceNextQuestion();
      }
    };

    this.submitAssessment = function() {
      $state.go('app.selectAssessment');
    };

    this.cancelAssessment = function() {
      $state.go('app.selectAssessment');
    };
  });
})();