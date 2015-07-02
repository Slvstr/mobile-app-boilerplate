// (function() {
//   'use strict';

//   angular.module('branch2.assessments')
//   .controller('AssessmentsCtrl', function($stateParams, $state) {
//   	this.availableAssessments = [];

//   	var firstAssessment = {
//   		name: 'First Assessment',
//   		questions: ['In the past 30 days, how would you say your physical health has been?', 
//   			'In the past 30 days, how many nights did you have trouble falling asleep or staying asleep?',
//   			'In the past 30 days, how many days have you felt depressed, anxious or very upset throughout most of the day?',
//   			'In the past 30 days, how many days did you drink ANY alcohol?'],
//   		answers: [['EXCELLENT', 'VERY GOOD', 'GOOD', 'FAIR', 'POOR'],
//   		['0', '1-3', '4-8', '9-15', '16-30'],
//   		['0', '1-3', '4-8', '9-15', '16-30'],
//   		['0', '1-3', '4-8', '9-15', '16-30']]
//   	};

//   	var secondAssessment = {
//   		name: 'Second Assessment',
//   		questions: ['How cool is this?', 
//   			'In the past 30 days, how many nights did you have trouble falling asleep or staying asleep because of these new screens?',
//   			'In the past 30 days, how many days have you felt depressed, anxious or very upset throughout most of the day because you didn\'t have these screens?',
//   			'In the past 30 days, how many days did you drink ANY alcohol?'],
//   		answers: [['EXCELLENT', 'VERY GOOD', 'GOOD', 'FAIR', 'POOR'],
//   		['0', '1-3', '4-8', '9-15', '16-30'],
//   		['0', '1-3', '4-8', '9-15', '16-30'],
//   		['0', '1-3', '4-8', '9-15', '16-30']]
//   	};

//   	this.availableAssessments.push(firstAssessment);
//   	this.availableAssessments.push(secondAssessment);

//   	var selectedAssessmentID = $stateParams.id;

//   	var currentQuestionIndex = 0;

//   	this.prompt = "";
//   	this.questionResponses = [];


//   	this.presentCurrentQuestion = function() {
//   		this.prompt = this.availableAssessments[selectedAssessmentID].questions[currentQuestionIndex];
//   		this.questionResponses = this.availableAssessments[selectedAssessmentID].answers[currentQuestionIndex];
//   	};

//   	this.selectAssessment = function(assessmentID) {
//   		$state.go('app.assessment',{id: assessmentID});
//   	};

//   	this.recordAnswer = function() {
//   		if (selectedAssessmentID !== undefined && currentQuestionIndex < this.availableAssessments[selectedAssessmentID].questions.length - 1) {
//   			currentQuestionIndex++;
//   			this.presentCurrentQuestion();
//   		}

//   		else {
//   			$state.go('app.beginAssessment');
//   		}
//   	};

//   	console.log("selectedAssessmentID: "+selectedAssessmentID);

//   	if (selectedAssessmentID !== undefined) {
//   		this.presentCurrentQuestion();
//   	}
//   });

// })();