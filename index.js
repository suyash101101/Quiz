const quizAppViews = ['.js-quiz-item-feedback-section','.js-start-page', 
'.js-quiz-item', '.js-quiz-state', '.js-feedback-page','.js-quiz-navigation',
'.js-success', '.js-failure'];

let quizApp = {
};

$(handleQuizApp);


function handleQuizApp() {
  renderStartPage();
  handleStartQuiz();
  handleAnswerSubmit();
  handleNextQuestion();
  handleRestartQuiz();
}


function updateView(viewsToShow) {
  let viewsToHide = quizAppViews.filter(function(element) {
    return !viewsToShow.includes(element);
  });
  viewsToShow.forEach(element => $(element).show());
  viewsToHide.forEach(element => $(element).hide());
}


function shuffleArray(array) {
  let i1, i2;
  for (i1 = array.length - 1; i1 > 0; i1--) {
    i2 = Math.floor(Math.random() * (i1 + 1));
    [array[i1], array[i2]] = [array[i2], array[i1]];
  }
}

function generateQuizFromStore() {
  shuffleArray(STORE);
  return STORE.slice(0,5);
}


function disableForm() {
  $('#js-quiz-item').find('input, button[type="submit"]').attr('disabled','disabled');  
}


function enableForm() {
  $('#js-quiz-item').find('input, button[type="submit"]').removeAttr('disabled');
}


function resetForm() {
  $('#js-quiz-item')[0].reset();
}


function resetQuizAppState() {
  quizApp = {
    currentQuiz: generateQuizFromStore(), 
    questionCounter: -1, 
    correctAnswers: 0, 
    incorrectAnswers: 0
  };
}

function renderQuestion() {
  currentQuestion = quizApp.currentQuiz[quizApp.questionCounter];

  resetForm();
  enableForm();


  $('.js-question').text(`Question ${quizApp.questionCounter+1} of 5: ${currentQuestion.question}`);
  currentQuestion.answers.forEach(function(answer, index) {
    $(`label[for="option-${index}"]`).text(answer);  
  });
}


function startNewQuiz() {
  resetQuizAppState();
  processNextQuestion();
  renderUserScore();   
}


function handleStartQuiz() {
  $('#startQuiz').on('click', function(event) {
    startNewQuiz();
  });
}

function handleAnswerSubmit() {
  $('#js-quiz-item').submit(function(event) {
    event.preventDefault();
    disableForm();
    
    const answer = $(this).find('input[name="answer-options"]:checked').closest('div').find('label').text();
    console.log(`Selected value is - ${answer}`);
    
    const feedbackMessage = generateFeedbackMessage(isCorrect(answer));
    
    updateUserScore(isCorrect(answer));

    renderQuestionFeedback(feedbackMessage);
    
    renderUserScore();
  });
}


function isCorrect(answer) {
  return answer === quizApp.currentQuiz[quizApp.questionCounter].correctAnswer;  
}

function generateFeedbackMessage(isCorrectAnswer) {
  return isCorrectAnswer ? 
  'The answer was correct.': 
  `The answer was incorrect. Correct answer is ${quizApp.currentQuiz[quizApp.questionCounter].correctAnswer}.`;
} 


function updateUserScore(isCorrectAnswer) {
  if(isCorrectAnswer) quizApp.correctAnswers++;
  else quizApp.incorrectAnswers++;
}


function renderQuestionFeedback(message) {
  $('.js-quiz-item-feedback').text(message);
  updateView(['.js-quiz-item-feedback-section', '.js-quiz-item','.js-quiz-state', '.js-quiz-navigation']);
}

function renderUserScore() {
  console.log(`Current user score - ${quizApp.correctAnswers}, ${quizApp.incorrectAnswers}`);
  $('.correct').text(quizApp.correctAnswers);
  $('.incorrect').text(quizApp.incorrectAnswers);
}


function renderStartPage() {
  updateView(['.js-start-page']);
}


function processNextQuestion() {
  // update the counter
  quizApp.questionCounter++;

  // if it is the last question - display feedback page instead
  if (quizApp.questionCounter===quizApp.currentQuiz.length) {
    renderFeedbackPage();
    return;
  }


  renderQuestion();

  updateView(['.js-quiz-item','.js-quiz-state']);
}


function handleNextQuestion() {
  $('#js-next-question').on('click', function(event) {
    processNextQuestion();
  });
}


function renderFeedbackPage() {

  let feedbackMessagePart = '';
  let imageToShow = '';
  if (quizApp.correctAnswers > quizApp.currentQuiz.length/2) {
    feedbackMessagePart = 'Success';
    imageToShow = '.js-success';
  }
  else {
    feedbackMessagePart = 'Failure';
    imageToShow = '.js-failure';
  }


  $('.js-quiz-feedback').text(`${feedbackMessagePart}! You've got ${quizApp.correctAnswers} out 5 questions right.`);

 
  updateView(['.js-feedback-page', imageToShow]);
}


function handleRestartQuiz() {
  $('#restartQuiz').on('click', function(event) {
    startNewQuiz();
  });
}