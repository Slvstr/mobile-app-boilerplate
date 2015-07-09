(function() {
  'use strict';

  angular.module('branch2.assessments')
  .factory('Assessments', function(AssessmentsStack, AssessmentsScoring, $q) {
  	// References to firebase locations we'll need.
  	var assessmentDataRef = new Firebase('https://intense-heat-8751.firebaseio.com/assessments');
  	var assessmentSubmissionsRef = new Firebase('https://intense-heat-8751.firebaseio.com/userInfo/Sam/assessmentHistory');
  	var availableAssessmentsRef = new Firebase('https://intense-heat-8751.firebaseio.com/userInfo/Sam/availableAssessments');

  	var currentAssessmentData; // Complete information about assessment, loaded when user makes a choice to take an assessment
    
    // Determines if the assessment is complete
    var assessmentComplete = function(questionID, response) {
      if (getNextQuestionID(questionID, response) === undefined) {
        return true;
      }

      return false;
    };

		// Determines the next questionID in the assessment.  The response to the current question will sometimes change the next question to be displayed.
		var getNextQuestionID = function(questionID, answer) {
      if (answer !== undefined) {
        if (answer.nextQuestionID !== undefined && answer.nextQuestionID !== null && answer.nextQuestionID !== '') {
          return answer.nextQuestionID;
        }
      }

      console.log("Current question ID: "+questionID);
      console.log("all questions array:");
      console.log(currentAssessmentData.questions);

			return currentAssessmentData.questions[questionID].nextQuestionID;
		};

    // Submits answers to firebase
    var postAnswers = function() {
      console.log(AssessmentsStack.getAnswerStack());
      assessmentSubmissionsRef.push(AssessmentsStack.getAnswerStack());
    };

  	return {
      // Determines if a given answer is a valid response to the current question
      answerValid: function(answer) {
        return true;
      },

  		// Submit the selected answer for a given questionID
  		// Returns the completion status of this assessment.
  		submitAnswer: function(answer, questionID) {
        //console.log(answer);
        AssessmentsStack.submitAnswerToAnswerStack(answer, getNextQuestionID(parseInt(questionID), answer));

        if (assessmentComplete(questionID)) {
          postAnswers();
          return true;
        }

        return false;
  		},

      // Advance the service up the question stack if possible.  If so, return the ID of the next question
      goNextQuestion: function() {
        return AssessmentsStack.ascendAssessmentAnswerStack();
      },

      // Lower the service down the question stack if possible.  If so, return the ID of the previous question
      goLastQuestion: function() {
        return AssessmentsStack.descendAssessmentAnswerStack();
      },

  		// Returns a promise which is fulfilled when the selected assessment has been loaded.
  		loadAssessment: function(assessmentID) {
  			return $q(function(resolve, reject) {
  				assessmentDataRef = new Firebase('https://intense-heat-8751.firebaseio.com/assessments/'+assessmentID);
  				assessmentDataRef.once('value', function(snapshot) {
		    		currentAssessmentData = snapshot.val();
            AssessmentsStack.initialize(parseInt(currentAssessmentData.firstQuestionID));
		  			resolve(true);
		  		});
  			});
  		},

  		// Returns the question information (prompt, answers) to the controller
  		getQuestionInformation: function() {
  			var questionInformation = {};
        var questionID = AssessmentsStack.getCurrentQuestionID();

  			questionInformation = currentAssessmentData.questions[questionID];
  			questionInformation.assessmentProgress = (parseInt(questionID))/currentAssessmentData.questions.length;
        questionInformation.answer = AssessmentsStack.getCurrentAnswer();
        questionInformation.leftBounded = AssessmentsStack.atBottomOfStack();
        questionInformation.rightBounded = AssessmentsStack.atTopOfStack();
  			return questionInformation;
  		},

  		// Returns a promise for the available assessments
  		getAvailableAssessments: function() {
				return $q(function(resolve, reject) {
					availableAssessmentsRef.once('value', function(snapshot) {
		    		var assessmentSelectionData = snapshot.val();
		  			resolve(assessmentSelectionData);
		  		});
				});
  		},

      getScores: function() {
        if (currentAssessmentData.resultsVisibleToPatient) {
          return AssessmentsScoring.getScores(currentAssessmentData, AssessmentsStack.getAnswerStack());
        }

        return undefined;
      }
  	};
  })

  
  // Contains all logic pertaining to the stack of answered questions
  .factory('AssessmentsStack', function() {
    var assessmentAnswerStack = []; // Contains the user's answers to assessment questions
    var assessmentAnswerStackPosition = 0; // Current position in answer stack

    // Returns true if we are not currently at the top of the stack and this answer will lead to a different question than the next highest stack entry.
    var answerRequiresTrimmingAnswerStack = function(nextQuestionID) {
      if (!atTopOfStack()) {
        if (nextQuestionID !== assessmentAnswerStack[assessmentAnswerStackPosition + 1].questionID) {
          return true;
        }
      }

      return false;
    };

    var clearAssessmentAnswerStack = function() {
      assessmentAnswerStack = []; // Contains the user's answers to assessment questions
      assessmentAnswerStackPosition = 0;
    };

    var appendToAssessmentAnswerStack = function(nextQuestionID, prompt) {
      var answer = {};
      answer.questionID = nextQuestionID;
      //answer.prompt = prompt;
      assessmentAnswerStack.push(answer);
    };

    // Returns true if currently sitting at the top of the stack
    var atTopOfStack = function() {
      return assessmentAnswerStack.length - assessmentAnswerStackPosition === 1;
    };

    // Returns true if currently sitting at the bottom of stack
    var atBottomOfStack = function() {
      return assessmentAnswerStackPosition === 0;
    };

    return {
      atTopOfStack: atTopOfStack, // Utilized above

      atBottomOfStack: atBottomOfStack,

      initialize: function(firstQuestionID) {
        clearAssessmentAnswerStack();
        appendToAssessmentAnswerStack(firstQuestionID);
      },

      submitAnswerToAnswerStack: function(answer, nextQuestionID) {
        if (answerRequiresTrimmingAnswerStack(nextQuestionID)) {
          console.log(assessmentAnswerStack);
          assessmentAnswerStack = assessmentAnswerStack.slice(0, assessmentAnswerStackPosition + 1);
          console.log("Trimmed answer stack:");
          console.log(assessmentAnswerStack);
        }

        assessmentAnswerStack[assessmentAnswerStackPosition].answer = answer;

        if (this.atTopOfStack() && nextQuestionID !== undefined) {
          appendToAssessmentAnswerStack(nextQuestionID);
        }

        console.log(assessmentAnswerStack);
      },

      getCurrentQuestionID: function() {
        return assessmentAnswerStack[assessmentAnswerStackPosition].questionID;
      },

      getCurrentAnswer: function() {
        return assessmentAnswerStack[assessmentAnswerStackPosition].answer;
      },

      getAnswerStack: function() {
        return assessmentAnswerStack;
      },

      // Returns the QuestionID for the previously answered question.  Returns undefined if at bottom of stack. 
      // Decrements assessmentAnswerStackPosition index variable
      descendAssessmentAnswerStack: function() {
        if (assessmentAnswerStackPosition !== 0) {
          assessmentAnswerStackPosition--;
          return assessmentAnswerStack[assessmentAnswerStackPosition].questionID;
        }

        else {
          return undefined;
        }
      },

      // Returns the QuestionID for the next known question.  Returns undefined if at top of stack. 
      // Increments assessmentAnswerStackPosition index variable
      ascendAssessmentAnswerStack: function() {
        if (assessmentAnswerStackPosition < assessmentAnswerStack.length - 1) {
          assessmentAnswerStackPosition++;
          return assessmentAnswerStack[assessmentAnswerStackPosition].questionID;
        }

        else {
          return undefined;
        }
      },
    };
  })

  // Contains all logic pertaining scoring of completed assessments.  
  .factory('AssessmentsScoring', function() {
    

    return {
      // Takes the assessmentdata and the answer stack, outputs all necessary processed scores.
      getScores: function(assessmentData, answerStack) {
        var processedScores = [];
        var answeredQuestions = [];

        if (assessmentData.scores === undefined) {
          return processedScores;
        }

        answerStack.forEach(function(question) {
          answeredQuestions[question.questionID] = question.answer;
        });

        assessmentData.scores.forEach(function(scoreSection) {
          var scoreSum = 0;
          var newScore = {};
          newScore.name = scoreSection.name;
          newScore.description = scoreSection.description;
          newScore.allRanges = scoreSection.ranges;
          newScore.rangesOccupying = [];

          // Add up the score for this section
          scoreSection.operations.forEach(function(operation) {
            if (answeredQuestions[operation.questionID] !== undefined) {
              console.log("answeredquestions id was valid");
              if (operation.operator === "+") {
                console.log("Was a plus operator.");
                scoreSum += parseInt(answeredQuestions[operation.questionID].value);
              }

              if (operation.operator === "-") {
                scoreSum -= parseInt(answeredQuestions[operation.questionID].value);
              }
            }
          });

          // Whichever ranges this score falls into, take note of them.
          scoreSection.ranges.forEach(function(range) {
            if (parseInt(range.min) <= scoreSum && parseInt(range.max) >= scoreSum) {
              newScore.rangesOccupying.push(range);
            }
          });

          newScore.score = scoreSum;
          processedScores.push(newScore);
        });

        console.log(processedScores);
        return processedScores;
      }
    };
  });
 })();