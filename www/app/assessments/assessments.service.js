(function() {
  'use strict';

  angular.module('branch2.assessments')
  .factory('Assessments', function($q, $http) {
  	// References to firebase locations we'll need.
  	var assessmentDataRef = new Firebase('https://intense-heat-8751.firebaseio.com/assessments');
  	var assessmentSubmissionsRef = new Firebase('https://intense-heat-8751.firebaseio.com/userInfo/Sam/assessmentHistory');
  	var availableAssessmentsRef = new Firebase('https://intense-heat-8751.firebaseio.com/userInfo/Sam/availableAssessments');

    var assessmentSelectionData = []; // Shorthand list of assessments user is allowed to take

  	var currentAssessmentData; // Complete information about assessment, loaded when user makes a choice to take an assessment
    var assessmentAnswerStack = []; // Contains the user's answers to assessment questions
    var assessmentAnswerStackPosition = 0; // Current position in answer stack


    var clearAssessmentAnswerStack = function() {
      assessmentAnswerStack = [];
      assessmentAnswerStackPosition = 0;
    };

    // Adds the next question to the answer stack
    var appendToAssessmentAnswerStack = function(nextQuestionID) {
      var answer = {};
      answer.questionID = nextQuestionID;
      assessmentAnswerStack.push(answer);

      console.log(assessmentAnswerStack);
    };

    // Returns true if we are not currently at the top of the stack and this answer will lead to a different question than the next highest stack entry.
    var answerRequiresTrimmingAnswerStack = function(answer) {
      if (assessmentAnswerStackPosition < assessmentAnswerStack.length - 1) {
        if (getNextQuestionID(assessmentAnswerStack[assessmentAnswerStackPosition].questionID, answer) !== assessmentAnswerStack[assessmentAnswerStackPosition + 1].questionID) {
          return true;
        }
      }

      return false;
    };

    // Applies the answer that the controller has submitted to the relevant entry in the stack of answered questions.
    // Check if we need to trim above stack entries, and do so if needed.
    var submitAnswerToAnswerStack = function(answer) {
      if (answerRequiresTrimmingAnswerStack(answer)) {
        assessmentAnswerStack = assessmentAnswerStack.slice(assessmentAnswerStackPosition + 1);
        console.log("Trimmed answer stack");
      }

      assessmentAnswerStack[assessmentAnswerStackPosition].answer = answer;
    };

    // Returns the QuestionID for the previously answered question.  Returns undefined if at bottom of stack. 
    // Decrements assessmentAnswerStackPosition index variable
    var descendAssessmentAnswerStack = function() {
      if (assessmentAnswerStackPosition !== 0) {
        assessmentAnswerStackPosition--;
        return assessmentAnswerStack[assessmentAnswerStackPosition].questionID;
      }

      else {
        return undefined;
      }
    };

    // Returns the QuestionID for the next known question.  Returns undefined if at top of stack. 
    // Increments assessmentAnswerStackPosition index variable
    var ascendAssessmentAnswerStack = function() {
      if (assessmentAnswerStackPosition < assessmentAnswerStack.length - 1) {
        assessmentAnswerStackPosition++;
        return assessmentAnswerStack[assessmentAnswerStackPosition].questionID;
      }

      else {
        return undefined;
      }
    };

    // Determines if the assessment is complete
    var assessmentComplete = function(questionID, response) {
      if (getNextQuestionID(questionID, response) === undefined) {
        return true;
      }

      return false;
    };

		// Determines the next questionID in the assessment.  The response to the current question will sometimes change the next question to be displayed.
		var getNextQuestionID = function(questionID, answer) {
			return currentAssessmentData.questions[questionID].nextQuestionID;
		};

  	return {
  		// Submit the selected answer for a given questionID
  		// Returns the completion status of this assessment.
  		submitAnswer: function(answer, assessmentID, questionID) {
        submitAnswerToAnswerStack(answer);

        if (assessmentComplete(questionID)) {
          return true;
        }
        
        if (assessmentAnswerStack.length - assessmentAnswerStackPosition === 1) {
          appendToAssessmentAnswerStack(getNextQuestionID(parseInt(questionID)));
        }

        return false;
  		},

      // Advance the service up the question stack if possible.  If so, return the ID of the next question
      goNextQuestion: function() {
        return ascendAssessmentAnswerStack();
      },

      // Lower the service down the question stack if possible.  If so, return the ID of the previous question
      goLastQuestion: function() {
        return descendAssessmentAnswerStack();
      },

  		// Returns a promise which is fulfilled when the selected assessment has been loaded.
  		loadAssessment: function(assessmentID) {
  			return $q(function(resolve, reject) {
          clearAssessmentAnswerStack();
  				assessmentDataRef = new Firebase('https://intense-heat-8751.firebaseio.com/assessments/'+assessmentID);
  				assessmentDataRef.once('value', function(snapshot) {
		    		currentAssessmentData = snapshot.val();
            appendToAssessmentAnswerStack(0);
		  			resolve(true);
		  		});
  			});
  		},

  		// Returns a promise for the question information (prompt, answers) given the assessmentID and questionID
  		getQuestionInformationGivenID: function(questionID) {
  			var questionInformation = {};

  			questionInformation.prompt = currentAssessmentData.questions[questionID].prompt;
  			questionInformation.format = currentAssessmentData.questions[questionID].type;
  			questionInformation.responses = currentAssessmentData.questions[questionID].responses;
  			questionInformation.assessmentProgress = (parseInt(questionID))/currentAssessmentData.questions.length;
        questionInformation.answer = assessmentAnswerStack[assessmentAnswerStackPosition].answer;

  			return $q(function(resolve, reject) {
  				resolve(questionInformation);
  			});
  		},

  		// Returns a promise for the available assessments
  		getAvailableAssessments: function() {
				return $q(function(resolve, reject) {
					availableAssessmentsRef.once('value', function(snapshot) {
		    		assessmentSelectionData = snapshot.val();
		  			resolve(assessmentSelectionData);
		  		});
				});
  		}
  	};
  });
 })();