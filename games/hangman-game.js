/**
 * Hangman Game Implementation for StudentBuddy
 */
window.loadHangmanGameImpl = function() {
  const gameContainer = document.getElementById('game-container');
  
  const gameHTML = `
    <div class="hangman-game">
      <div class="game-header">
        <div class="score-container">
          <div>Score: <span id="hangman-score">0</span></div>
          <div>High Score: <span id="hangman-high-score">0</span></div>
        </div>
        <div class="attempts-container">
          <div>Attempts Left: <span id="attempts-left">6</span></div>
        </div>
      </div>
      
      <div class="hangman-container">
        <div class="hangman-drawing">
          <svg id="hangman-svg" width="200" height="250" viewBox="0 0 200 250">
            <!-- Base -->
            <line x1="20" y1="230" x2="100" y2="230" stroke="#333" stroke-width="3" />
            <!-- Pole -->
            <line x1="60" y1="230" x2="60" y2="30" stroke="#333" stroke-width="3" id="hangman-pole" class="hidden" />
            <!-- Top -->
            <line x1="60" y1="30" x2="140" y2="30" stroke="#333" stroke-width="3" id="hangman-top" class="hidden" />
            <!-- Rope -->
            <line x1="140" y1="30" x2="140" y2="60" stroke="#333" stroke-width="3" id="hangman-rope" class="hidden" />
            <!-- Head -->
            <circle cx="140" cy="80" r="20" stroke="#333" stroke-width="3" fill="transparent" id="hangman-head" class="hidden" />
            <!-- Body -->
            <line x1="140" y1="100" x2="140" y2="150" stroke="#333" stroke-width="3" id="hangman-body" class="hidden" />
            <!-- Left Arm -->
            <line x1="140" y1="120" x2="120" y2="140" stroke="#333" stroke-width="3" id="hangman-left-arm" class="hidden" />
            <!-- Right Arm -->
            <line x1="140" y1="120" x2="160" y2="140" stroke="#333" stroke-width="3" id="hangman-right-arm" class="hidden" />
            <!-- Left Leg -->
            <line x1="140" y1="150" x2="120" y2="190" stroke="#333" stroke-width="3" id="hangman-left-leg" class="hidden" />
            <!-- Right Leg -->
            <line x1="140" y1="150" x2="160" y2="190" stroke="#333" stroke-width="3" id="hangman-right-leg" class="hidden" />
          </svg>
        </div>
        
        <div class="game-info">
          <div class="word-display" id="word-display">
            <!-- Word display will be added here -->
          </div>
          
          <div class="category-display">
            Category: <span id="word-category">General</span>
          </div>
          
          <div class="keyboard" id="hangman-keyboard">
            <!-- Keyboard will be added here -->
          </div>
        </div>
      </div>
      
      <div class="game-controls">
        <button id="new-word-btn" class="btn">New Word</button>
        <div class="hint-container">
          <button id="hint-btn" class="btn">Get Hint</button>
          <div id="hint-display" class="hint-display"></div>
        </div>
      </div>
      
      <div id="game-message" class="game-message">
        <!-- Game messages will appear here -->
      </div>
    </div>
    <style>
      .hangman-game {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }
      
      .game-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      
      .score-container, .attempts-container {
        font-weight: bold;
      }
      
      .hangman-container {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        margin-bottom: 30px;
      }
      
      .hangman-drawing {
        flex: 0 0 200px;
        background-color: #f5f9fc;
        border-radius: 8px;
        padding: 15px;
      }
      
      .game-info {
        flex: 1;
        min-width: 300px;
      }
      
      .word-display {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 20px;
        min-height: 60px;
      }
      
      .letter-box {
        width: 40px;
        height: 50px;
        border-bottom: 3px solid #333;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-weight: bold;
      }
      
      .category-display {
        text-align: center;
        margin-bottom: 20px;
        color: #666;
        font-style: italic;
      }
      
      .keyboard {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
        gap: 10px;
        margin: 0 auto;
      }
      
      .key {
        height: 40px;
        background-color: #e0e0e0;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .key:hover {
        background-color: #d0d0d0;
      }
      
      .key.used {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .key.correct {
        background-color: #4caf50;
        color: white;
      }
      
      .key.wrong {
        background-color: #f44336;
        color: white;
      }
      
      .game-controls {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      
      .hint-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      
      .hint-display {
        margin-top: 10px;
        padding: 10px;
        background-color: #fff8e1;
        border-radius: 4px;
        max-width: 300px;
        display: none;
      }
      
      .game-message {
        text-align: center;
        margin-top: 20px;
        padding: 15px;
        border-radius: 8px;
        font-weight: bold;
        display: none;
      }
      
      .game-message.success {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
      
      .game-message.error {
        background-color: #ffebee;
        color: #c62828;
      }
      
      .hidden {
        visibility: hidden;
      }
      
      @media (max-width: 600px) {
        .hangman-container {
          flex-direction: column;
        }
        
        .hangman-drawing {
          margin: 0 auto;
        }
        
        .letter-box {
          width: 30px;
          height: 40px;
          font-size: 20px;
        }
      }
    </style>
  `;

  gameContainer.innerHTML = gameHTML;

  // DOM Elements
  const wordDisplay = document.getElementById('word-display');
  const wordCategory = document.getElementById('word-category');
  const keyboard = document.getElementById('hangman-keyboard');
  const attemptsLeft = document.getElementById('attempts-left');
  const scoreDisplay = document.getElementById('hangman-score');
  const highScoreDisplay = document.getElementById('hangman-high-score');
  const newWordBtn = document.getElementById('new-word-btn');
  const hintBtn = document.getElementById('hint-btn');
  const hintDisplay = document.getElementById('hint-display');
  const gameMessage = document.getElementById('game-message');
  
  // Hangman drawing parts
  const hangmanParts = [
    'hangman-pole',
    'hangman-top',
    'hangman-rope',
    'hangman-head',
    'hangman-body',
    'hangman-left-arm',
    'hangman-right-arm',
    'hangman-left-leg',
    'hangman-right-leg'
  ];

  // Game state
  let currentWord = '';
  let currentCategory = '';
  let currentHint = '';
  let guessedLetters = [];
  let remainingAttempts = 6;
  let score = 0;
  let highScore = localStorage.getItem('hangmanHighScore') || 0;
  let isGameOver = false;

  // Word categories
  const wordCategories = [
    {
      name: 'Animals',
      words: [
        { word: 'ELEPHANT', hint: 'Largest land mammal with a trunk' },
        { word: 'DOLPHIN', hint: 'Intelligent marine mammal known for its playfulness' },
        { word: 'GIRAFFE', hint: 'Tallest living animal with a long neck' },
        { word: 'PENGUIN', hint: 'Flightless bird that lives in the Southern Hemisphere' },
        { word: 'KANGAROO', hint: 'Australian marsupial known for hopping and carrying babies in a pouch' }
      ]
    },
    {
      name: 'Countries',
      words: [
        { word: 'AUSTRALIA', hint: 'Country that is also a continent' },
        { word: 'JAPAN', hint: 'Island nation known for sushi and cherry blossoms' },
        { word: 'BRAZIL', hint: 'South American country famous for the Amazon rainforest' },
        { word: 'EGYPT', hint: 'North African country home to the pyramids' },
        { word: 'CANADA', hint: 'Second largest country by land area, known for maple syrup' }
      ]
    },
    {
      name: 'Fruits',
      words: [
        { word: 'PINEAPPLE', hint: 'Tropical fruit with a spiky exterior and sweet interior' },
        { word: 'WATERMELON', hint: 'Large, juicy summer fruit with green rind and red flesh' },
        { word: 'STRAWBERRY', hint: 'Small red fruit with seeds on the outside' },
        { word: 'KIWI', hint: 'Small brown fuzzy fruit with green flesh' },
        { word: 'DRAGONFRUIT', hint: 'Exotic fruit with pink or white flesh dotted with black seeds' }
      ]
    },
    {
      name: 'Sports',
      words: [
        { word: 'BASKETBALL', hint: 'Team sport where players try to shoot a ball through a hoop' },
        { word: 'SWIMMING', hint: 'Olympic sport performed in water' },
        { word: 'TENNIS', hint: 'Racket sport played on a court with a net in the middle' },
        { word: 'VOLLEYBALL', hint: 'Team sport where players hit a ball over a net' },
        { word: 'GYMNASTICS', hint: 'Sport involving physical exercises requiring balance, strength, and flexibility' }
      ]
    },
    {
      name: 'Technology',
      words: [
        { word: 'INTERNET', hint: 'Global computer network providing information and communication' },
        { word: 'SMARTPHONE', hint: 'Portable device combining a phone with a computer' },
        { word: 'ROBOT', hint: 'Machine capable of carrying out complex actions automatically' },
        { word: 'BLOCKCHAIN', hint: 'Technology behind cryptocurrencies' },
        { word: 'VIRTUAL', hint: 'Something that exists in simulation or online, not physically' }
      ]
    }
  ];

  // Initialize the game
  initGame();

  // Create keyboard
  function createKeyboard() {
    const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    keyboard.innerHTML = '';
    
    keys.forEach(key => {
      const button = document.createElement('button');
      button.textContent = key;
      button.className = 'key';
      button.addEventListener('click', () => handleGuess(key));
      keyboard.appendChild(button);
    });
    
    // Add keyboard listener
    document.addEventListener('keydown', handleKeyPress);
  }

  function handleKeyPress(e) {
    if (isGameOver) return;
    
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
      // Find the corresponding button
      const button = [...keyboard.children].find(btn => btn.textContent === key);
      if (button && !button.classList.contains('used')) {
        handleGuess(key);
      }
    }
  }

  function handleGuess(letter) {
    if (isGameOver) return;
    
    const button = [...keyboard.children].find(btn => btn.textContent === letter);
    
    // Skip if already guessed
    if (guessedLetters.includes(letter) || button.classList.contains('used')) {
      return;
    }
    
    guessedLetters.push(letter);
    button.classList.add('used');
    
    if (currentWord.includes(letter)) {
      // Correct guess
      button.classList.add('correct');
      updateWordDisplay();
      
      // Check if player has won
      if (isWordComplete()) {
        handleWin();
      }
    } else {
      // Wrong guess
      button.classList.add('wrong');
      remainingAttempts--;
      attemptsLeft.textContent = remainingAttempts;
      
      // Show next part of hangman
      const partIndex = 6 - remainingAttempts;
      if (partIndex < hangmanParts.length) {
        document.getElementById(hangmanParts[partIndex - 1]).classList.remove('hidden');
      }
      
      // Check if player has lost
      if (remainingAttempts === 0) {
        handleLoss();
      }
    }
  }

  function updateWordDisplay() {
    wordDisplay.innerHTML = '';
    
    currentWord.split('').forEach(letter => {
      const letterBox = document.createElement('div');
      letterBox.className = 'letter-box';
      
      if (guessedLetters.includes(letter)) {
        letterBox.textContent = letter;
      }
      
      wordDisplay.appendChild(letterBox);
    });
  }

  function isWordComplete() {
    return currentWord.split('').every(letter => guessedLetters.includes(letter));
  }

  function handleWin() {
    isGameOver = true;
    
    // Calculate score: base points + remaining attempts bonus
    const newPoints = 100 + (remainingAttempts * 25);
    score += newPoints;
    scoreDisplay.textContent = score;
    
    // Update high score if needed
    if (score > highScore) {
      highScore = score;
      highScoreDisplay.textContent = highScore;
      localStorage.setItem('hangmanHighScore', highScore);
    }
    
    // Show win message
    gameMessage.textContent = `Congratulations! You guessed the word. +${newPoints} points!`;
    gameMessage.className = 'game-message success';
    gameMessage.style.display = 'block';
    
    // Remove keyboard listener
    document.removeEventListener('keydown', handleKeyPress);
  }

  function handleLoss() {
    isGameOver = true;
    
    // Reveal the word
    wordDisplay.innerHTML = '';
    currentWord.split('').forEach(letter => {
      const letterBox = document.createElement('div');
      letterBox.className = 'letter-box';
      letterBox.textContent = letter;
      letterBox.style.color = guessedLetters.includes(letter) ? 'black' : '#f44336';
      wordDisplay.appendChild(letterBox);
    });
    
    // Show loss message
    gameMessage.textContent = `Game over! The word was "${currentWord}".`;
    gameMessage.className = 'game-message error';
    gameMessage.style.display = 'block';
    
    // Remove keyboard listener
    document.removeEventListener('keydown', handleKeyPress);
  }

  function getRandomWord() {
    // Select random category
    const category = wordCategories[Math.floor(Math.random() * wordCategories.length)];
    
    // Select random word from category
    const wordObject = category.words[Math.floor(Math.random() * category.words.length)];
    
    return {
      word: wordObject.word,
      category: category.name,
      hint: wordObject.hint
    };
  }

  function initGame() {
    // Reset game state
    guessedLetters = [];
    remainingAttempts = 6;
    isGameOver = false;
    
    // Hide hangman parts
    hangmanParts.forEach(part => {
      document.getElementById(part).classList.add('hidden');
    });
    
    // Reset displays
    attemptsLeft.textContent = remainingAttempts;
    highScoreDisplay.textContent = highScore;
    gameMessage.style.display = 'none';
    hintDisplay.style.display = 'none';
    
    // Get new word
    const wordData = getRandomWord();
    currentWord = wordData.word;
    currentCategory = wordData.category;
    currentHint = wordData.hint;
    
    // Update UI
    wordCategory.textContent = currentCategory;
    
    // Create word display and keyboard
    updateWordDisplay();
    createKeyboard();
    
    // Add event listeners
    document.addEventListener('keydown', handleKeyPress);
  }

  // Button event listeners
  newWordBtn.addEventListener('click', () => {
    initGame();
  });
  
  hintBtn.addEventListener('click', () => {
    if (hintDisplay.style.display === 'none' || hintDisplay.style.display === '') {
      hintDisplay.textContent = currentHint;
      hintDisplay.style.display = 'block';
      
      // Penalty for using hint
      if (!isGameOver) {
        remainingAttempts = Math.max(remainingAttempts - 1, 0);
        attemptsLeft.textContent = remainingAttempts;
        
        // Show next part of hangman
        const partIndex = 6 - remainingAttempts;
        if (partIndex > 0 && partIndex <= hangmanParts.length) {
          document.getElementById(hangmanParts[partIndex - 1]).classList.remove('hidden');
        }
        
        // Check if player has lost due to hint penalty
        if (remainingAttempts === 0) {
          handleLoss();
        }
      }
    } else {
      hintDisplay.style.display = 'none';
    }
  });
};

// For backward compatibility
function loadHangmanGame() {
  window.loadHangmanGameImpl();
}
