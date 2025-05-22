/**
 * Trivia Quiz Game Implementation for StudentBuddy
 */
window.loadTriviaQuizGame = function() {
  const gameContainer = document.getElementById('game-container');
  
  const gameHTML = `
    <div class="trivia-quiz-game">
      <div class="quiz-header">
        <div class="quiz-progress">
          <div class="progress-text">Question <span id="current-question">1</span>/<span id="total-questions">10</span></div>
          <div class="progress-bar">
            <div id="progress-indicator"></div>
          </div>
        </div>
        <div class="quiz-score">
          <span>Score: </span>
          <span id="quiz-score">0</span>
        </div>
      </div>
      
      <div class="quiz-container">
        <div id="quiz-category" class="quiz-category">General Knowledge</div>
        <div id="quiz-question" class="quiz-question">Loading question...</div>
        
        <div id="answer-options" class="answer-options">
          <button class="answer-btn" data-index="0">Loading...</button>
          <button class="answer-btn" data-index="1">Loading...</button>
          <button class="answer-btn" data-index="2">Loading...</button>
          <button class="answer-btn" data-index="3">Loading...</button>
        </div>
        
        <div id="quiz-feedback" class="quiz-feedback">
          <!-- Feedback will appear here -->
        </div>
      </div>
      
      <div class="quiz-controls">
        <button id="next-question" class="btn" disabled>Next Question</button>
        <button id="new-quiz" class="btn">New Quiz</button>
      </div>
      
      <div id="quiz-results" class="quiz-results">
        <!-- Final results will appear here -->
      </div>
    </div>
    <style>
      .trivia-quiz-game {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }
      
      .quiz-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .quiz-progress {
        flex-grow: 1;
        margin-right: 20px;
      }
      
      .progress-text {
        margin-bottom: 5px;
        font-weight: bold;
      }
      
      .progress-bar {
        height: 10px;
        background-color: #e0e0e0;
        border-radius: 5px;
        overflow: hidden;
      }
      
      #progress-indicator {
        height: 100%;
        background-color: #004c97;
        width: 10%;
        transition: width 0.3s ease;
      }
      
      .quiz-score {
        font-weight: bold;
        font-size: 1.2em;
        color: #004c97;
      }
      
      .quiz-container {
        background-color: #f5f9fc;
        border-radius: 8px;
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .quiz-category {
        font-size: 0.9em;
        color: #666;
        margin-bottom: 10px;
        font-style: italic;
      }
      
      .quiz-question {
        font-size: 1.3em;
        margin-bottom: 25px;
        line-height: 1.4;
        font-weight: 500;
      }
      
      .answer-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 20px;
      }
      
      .answer-btn {
        padding: 15px;
        background-color: #fff;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 1em;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s ease;
      }
      
      .answer-btn:hover {
        border-color: #004c97;
        background-color: #f0f7ff;
      }
      
      .answer-btn.correct {
        background-color: #dff7e5;
        border-color: #4caf50;
        color: #2e7d32;
      }
      
      .answer-btn.incorrect {
        background-color: #ffebee;
        border-color: #f44336;
        color: #c62828;
      }
      
      .answer-btn.selected {
        border-width: 3px;
      }
      
      .quiz-feedback {
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        display: none;
      }
      
      .quiz-feedback.correct {
        background-color: #dff7e5;
        color: #2e7d32;
      }
      
      .quiz-feedback.incorrect {
        background-color: #ffebee;
        color: #c62828;
      }
      
      .quiz-controls {
        display: flex;
        justify-content: space-between;
        gap: 15px;
      }
      
      #next-question {
        flex-grow: 1;
        background-color: #004c97;
        color: white;
      }
      
      #new-quiz {
        background-color: #e0e0e0;
      }
      
      .quiz-results {
        background-color: #f5f9fc;
        border-radius: 8px;
        padding: 30px;
        margin-top: 30px;
        text-align: center;
        display: none;
      }
      
      .quiz-results h3 {
        color: #004c97;
        margin-bottom: 15px;
      }
      
      .results-score {
        font-size: 2em;
        font-weight: bold;
        margin-bottom: 20px;
        color: #004c97;
      }
      
      .results-message {
        margin-bottom: 20px;
      }
      
      @media (max-width: 600px) {
        .answer-options {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;

  gameContainer.innerHTML = gameHTML;

  // DOM Elements
  const currentQuestionEl = document.getElementById('current-question');
  const totalQuestionsEl = document.getElementById('total-questions');
  const progressIndicator = document.getElementById('progress-indicator');
  const scoreDisplay = document.getElementById('quiz-score');
  const categoryDisplay = document.getElementById('quiz-category');
  const questionDisplay = document.getElementById('quiz-question');
  const answerOptions = document.getElementById('answer-options');
  const answerButtons = document.querySelectorAll('.answer-btn');
  const feedbackEl = document.getElementById('quiz-feedback');
  const nextQuestionBtn = document.getElementById('next-question');
  const newQuizBtn = document.getElementById('new-quiz');
  const resultsEl = document.getElementById('quiz-results');

  // Game state
  let currentQuiz = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let hasAnswered = false;
  const totalQuestions = 10;

  // Initialize game
  initGame();

  // Event listeners
  answerOptions.addEventListener('click', (e) => {
    if (!e.target.classList.contains('answer-btn') || hasAnswered) return;
    
    hasAnswered = true;
    const selectedBtn = e.target;
    const selectedIndex = parseInt(selectedBtn.dataset.index);
    const currentQuestion = currentQuiz[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    
    // Visual feedback on buttons
    answerButtons.forEach(btn => {
      const index = parseInt(btn.dataset.index);
      
      if (index === currentQuestion.correctIndex) {
        btn.classList.add('correct');
      } else if (index === selectedIndex) {
        btn.classList.add('incorrect', 'selected');
      }
    });
    
    // Show feedback message
    feedbackEl.classList.remove('correct', 'incorrect');
    if (isCorrect) {
      feedbackEl.classList.add('correct');
      feedbackEl.textContent = `Correct! ${currentQuestion.explanation || ''}`;
      score += 10;
      scoreDisplay.textContent = score;
    } else {
      feedbackEl.classList.add('incorrect');
      feedbackEl.textContent = `Incorrect. The correct answer is: ${currentQuestion.answers[currentQuestion.correctIndex]}. ${currentQuestion.explanation || ''}`;
    }
    feedbackEl.style.display = 'block';
    
    // Enable next question button
    nextQuestionBtn.disabled = false;
  });

  nextQuestionBtn.addEventListener('click', () => {
    if (currentQuestionIndex < currentQuiz.length - 1) {
      currentQuestionIndex++;
      loadQuestion();
    } else {
      showResults();
    }
  });

  newQuizBtn.addEventListener('click', initGame);

  // Functions
  function initGame() {
    // Reset game state
    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.textContent = '0';
    resultsEl.style.display = 'none';
    document.querySelector('.quiz-container').style.display = 'block';
    document.querySelector('.quiz-controls').style.display = 'flex';
    nextQuestionBtn.disabled = true;
    
    // Get questions
    fetchQuestions()
      .then(questions => {
        currentQuiz = questions;
        totalQuestionsEl.textContent = questions.length;
        loadQuestion();
      })
      .catch(error => {
        console.error('Error loading questions:', error);
        // Fallback to sample questions if fetch fails
        currentQuiz = getSampleQuestions();
        totalQuestionsEl.textContent = currentQuiz.length;
        loadQuestion();
      });
  }

  function loadQuestion() {
    // Reset state for new question
    hasAnswered = false;
    feedbackEl.style.display = 'none';
    nextQuestionBtn.disabled = true;
    
    // Update progress
    currentQuestionEl.textContent = currentQuestionIndex + 1;
    progressIndicator.style.width = `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%`;
    
    // Get current question
    const question = currentQuiz[currentQuestionIndex];
    
    // Update UI
    categoryDisplay.textContent = question.category;
    questionDisplay.textContent = question.question;
    
    // Clear previous button styles
    answerButtons.forEach(btn => {
      btn.classList.remove('correct', 'incorrect', 'selected');
    });
    
    // Set answers
    question.answers.forEach((answer, index) => {
      const button = answerButtons[index];
      button.textContent = answer;
      button.disabled = false;
    });
  }

  function showResults() {
    // Hide quiz container and controls
    document.querySelector('.quiz-container').style.display = 'none';
    document.querySelector('.quiz-controls').style.display = 'none';
    
    // Prepare results message based on score
    const percentage = (score / (currentQuiz.length * 10)) * 100;
    let message;
    
    if (percentage >= 90) {
      message = "Excellent! You're a trivia master!";
    } else if (percentage >= 70) {
      message = "Great job! You know your stuff!";
    } else if (percentage >= 50) {
      message = "Good effort! Keep learning!";
    } else {
      message = "Keep practicing! You'll improve next time!";
    }
    
    // Show results
    resultsEl.innerHTML = `
      <h3>Quiz Complete!</h3>
      <div class="results-score">${score} / ${currentQuiz.length * 10}</div>
      <p class="results-message">${message}</p>
      <button id="retry-quiz" class="btn">Try Again</button>
    `;
    
    resultsEl.style.display = 'block';
    
    // Add event listener to retry button
    document.getElementById('retry-quiz').addEventListener('click', initGame);
  }

  async function fetchQuestions() {
    try {
      // Fetch from Open Trivia DB
      const response = await fetch(`https://opentdb.com/api.php?amount=${totalQuestions}&type=multiple`);
      const data = await response.json();
      
      if (data.response_code !== 0) {
        throw new Error('Failed to get questions from API');
      }
      
      // Format the questions
      return data.results.map(q => {
        // Create array with all answers
        const answers = [...q.incorrect_answers, q.correct_answer];
        
        // Randomly shuffle answers
        for (let i = answers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        
        // Find index of correct answer
        const correctIndex = answers.indexOf(q.correct_answer);
        
        return {
          category: q.category,
          question: decodeHTMLEntities(q.question),
          answers: answers.map(a => decodeHTMLEntities(a)),
          correctIndex: correctIndex
        };
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  function getSampleQuestions() {
    // Backup questions in case API fails
    return [
      {
        category: "Science",
        question: "What is the chemical symbol for gold?",
        answers: ["Go", "Gl", "Au", "Ag"],
        correctIndex: 2
      },
      {
        category: "Geography",
        question: "Which is the largest ocean on Earth?",
        answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctIndex: 3
      },
      {
        category: "History",
        question: "In which year did World War II end?",
        answers: ["1943", "1945", "1947", "1950"],
        correctIndex: 1
      },
      {
        category: "Literature",
        question: "Who wrote 'Romeo and Juliet'?",
        answers: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"],
        correctIndex: 2
      },
      {
        category: "Science",
        question: "What is the closest planet to the Sun?",
        answers: ["Venus", "Earth", "Mars", "Mercury"],
        correctIndex: 3
      },
      {
        category: "Sports",
        question: "In which country were the first modern Olympic Games held?",
        answers: ["France", "Greece", "United States", "Italy"],
        correctIndex: 1
      },
      {
        category: "Food & Drink",
        question: "Which fruit is known as the 'king of fruits'?",
        answers: ["Apple", "Banana", "Mango", "Durian"],
        correctIndex: 3
      },
      {
        category: "Movies",
        question: "What was the first feature-length animated movie ever released?",
        answers: ["Snow White and the Seven Dwarfs", "Pinocchio", "Bambi", "Dumbo"],
        correctIndex: 0
      },
      {
        category: "Music",
        question: "Which band released the album 'Abbey Road'?",
        answers: ["The Rolling Stones", "The Beatles", "Pink Floyd", "Led Zeppelin"],
        correctIndex: 1
      },
      {
        category: "Technology",
        question: "Who is often called the father of the World Wide Web?",
        answers: ["Tim Berners-Lee", "Bill Gates", "Steve Jobs", "Mark Zuckerberg"],
        correctIndex: 0
      }
    ];
  }

  // Helper function to decode HTML entities
  function decodeHTMLEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }
};

// For backward compatibility
function loadTriviaQuizGame() {
  window.loadTriviaQuizGame();
}
