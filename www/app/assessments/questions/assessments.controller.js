(function() {
  'use strict';

  angular.module('branch2.assessments')
  .controller('AssessmentsCtrl', function($scope, $stateParams, $state, $ionicSideMenuDelegate, Assessments, $timeout) {
    self = this;

  	var selectedAssessmentID = $stateParams.AssessmentId;
    var selectedQuestionID = $stateParams.QuestionId;

  	this.prompt = "";
  	this.questionResponses = [];
    this.questionInformation = {};

    // This event is fired every time we enter the select assessment view.  Ionic will cache 10 views by default, so performing these actions on controller creation wouldn't always make sense.
    $scope.$on("$ionicView.beforeEnter", function() {
      $ionicSideMenuDelegate.canDragContent(false);

      // Retrieve the information for this question, and set that information to be displayed.
      self.questionInformation = Assessments.getQuestionInformation();

      if (self.questionInformation === undefined) {
        self.returnToAssessmentSelection();
      }
      // console.log(self.questionInformation);
    });

    // Is used to set a button to the active state when the button's associated answer has been previously select.
    this.isButtonResponseSelected = function(buttonAnswer) {
      if (self.questionInformation.answer !== undefined) {
        return buttonAnswer == self.questionInformation.answer;
      }

      return false;
    };

    // Request to advance to the next question from the service.  If a next question exists, transition to that view.
    this.advanceNextQuestion = function() {
      var nextQuestionID = Assessments.goNextQuestion();
      if (nextQuestionID !== undefined ) {
        $state.go('app.assessment',{AssessmentId: selectedAssessmentID, QuestionId: nextQuestionID});
      }
    };

    // Determines the visibility of the forward and backward navigation buttons.
    this.navigationAvailable = function(direction) {
      if (direction === 'backward') {
        return !self.questionInformation.leftBounded;
      }

      if (direction === 'forward') {
        return !self.questionInformation.rightBounded;
      }

      return false;
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
    this.recordAnswer = function(answer) {
      var assessmentCompleted;

      if (answer === undefined) {
        answer = self.questionInformation.answer;
      }

      if (!Assessments.answerValid(answer)) {
        return;
      }

      assessmentCompleted = Assessments.submitAnswer(answer, selectedQuestionID);

      if (assessmentCompleted) {
        self.goToResults();
      }
      else {
        self.advanceNextQuestion();
      }
    };

    this.returnToAssessmentSelection = function() {
      $state.go('app.selectAssessment');
    };

    this.goToResults = function() {
      $state.go('app.endAssessment');
    };
  });
})();