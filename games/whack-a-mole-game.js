/**
 * Whack-a-Mole Game Implementation for StudentBuddy
 */
window.loadWhackAMoleGameImpl = function() {
  const gameContainer = document.getElementById('game-container');
  
  const gameHTML = `
    <div class="whack-a-mole-game">
      <div class="game-header">
        <div class="score-section">
          <div>Score: <span id="whack-score">0</span></div>
          <div>High Score: <span id="whack-high-score">0</span></div>
        </div>
        <div class="time-section">
          <div>Time Left: <span id="time-left">60</span>s</div>
        </div>
      </div>
      
      <div class="game-controls">
        <button id="start-game" class="btn">Start Game</button>
        <div class="level-selector">
          <span>Difficulty: </span>
          <select id="difficulty-level">
            <option value="easy">Easy</option>
            <option value="medium" selected>Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
      
      <div class="game-board">
        <div class="mole-container" id="mole-container">
          <!-- Moles will be added here -->
        </div>
      </div>
      
      <div id="game-message" class="game-message">
        Click 'Start Game' to begin!
      </div>
    </div>
    <style>
      .whack-a-mole-game {
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        font-family: Arial, sans-serif;
      }
      
      .game-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: bold;
      }
      
      .game-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .level-selector {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      #difficulty-level {
        padding: 5px 10px;
        border-radius: 4px;
      }
      
      .game-board {
        background-color: #8bc34a;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 20px;
      }
      
      .mole-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
      
      .mole-hole {
        position: relative;
        width: 100%;
        padding-bottom: 100%;
        background-color: #5d4037;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
      }
      
      .mole {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: bottom center;
        transition: bottom 0.1s;
        transform: translateY(100%);
      }
      
      .mole.visible {
        transform: translateY(0);
      }
      
      .mole.hit {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzc5NTU0OCIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzUiIHI9IjUiIGZpbGw9ImJsYWNrIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSIzNSIgcj0iNSIgZmlsbD0iYmxhY2siLz48cGF0aCBkPSJNMzAgNjUgUTUwIDUwIDcwIDY1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=');
        transform: translateY(60%);
      }
      
      .mole:not(.hit) {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzc5NTU0OCIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzUiIHI9IjUiIGZpbGw9ImJsYWNrIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSIzNSIgcj0iNSIgZmlsbD0iYmxhY2siLz48cGF0aCBkPSJNMzAgNzAgUTUwIDgwIDcwIDcwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=');
      }
      
      .game-message {
        text-align: center;
        font-size: 18px;
        padding: 10px;
        border-radius: 5px;
        background-color: #f5f5f5;
      }
      
      .hit-effect {
        position: absolute;
        pointer-events: none;
        z-index: 100;
      }
      
      @media (max-width: 500px) {
        .mole-container {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .game-controls {
          flex-direction: column;
          gap: 10px;
          align-items: stretch;
        }
        
        .level-selector {
          justify-content: center;
        }
      }
    </style>
  `;

  gameContainer.innerHTML = gameHTML;

  // DOM Elements
  const scoreDisplay = document.getElementById('whack-score');
  const highScoreDisplay = document.getElementById('whack-high-score');
  const timeLeftDisplay = document.getElementById('time-left');
  const startButton = document.getElementById('start-game');
  const difficultySelect = document.getElementById('difficulty-level');
  const moleContainer = document.getElementById('mole-container');
  const gameMessage = document.getElementById('game-message');
  
  // Game variables
  let score = 0;
  let highScore = localStorage.getItem('whackHighScore') || 0;
  let timeLeft = 60;
  let gameInterval;
  let moleInterval;
  let isPlaying = false;
  
  // Difficulty settings (mole show time in ms, and probability of showing)
  const difficultySettings = {
    easy: { showTime: 1500, probability: 0.3 },
    medium: { showTime: 1000, probability: 0.4 },
    hard: { showTime: 800, probability: 0.5 }
  };
  
  // Initialize high score display
  highScoreDisplay.textContent = highScore;
  
  // Create mole holes
  function createMoleHoles() {
    moleContainer.innerHTML = '';
    
    // Create 9 mole holes (3x3 grid)
    for (let i = 0; i < 9; i++) {
      const hole = document.createElement('div');
      hole.className = 'mole-hole';
      
      const mole = document.createElement('div');
      mole.className = 'mole';
      mole.dataset.index = i;
      
      // Event for whacking a mole
      mole.addEventListener('click', whackMole);
      
      hole.appendChild(mole);
      moleContainer.appendChild(hole);
    }
  }
  
  // Update the game display
  function updateDisplay() {
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timeLeft;
    
    if (score > highScore) {
      highScore = score;
      highScoreDisplay.textContent = highScore;
      localStorage.setItem('whackHighScore', highScore);
    }
  }
  
  // Start the game
  function startGame() {
    if (isPlaying) return;
    
    // Reset game state
    score = 0;
    timeLeft = 60;
    isPlaying = true;
    
    // Update UI
    updateDisplay();
    startButton.textContent = 'Game in Progress';
    startButton.disabled = true;
    difficultySelect.disabled = true;
    gameMessage.textContent = 'Whack those moles!';
    
    // Start game timer
    gameInterval = setInterval(() => {
      timeLeft--;
      updateDisplay();
      
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
    
    // Start spawning moles
    spawnMoles();
  }
  
  // End the game
  function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(moleInterval);
    
    // Hide all moles
    const moles = document.querySelectorAll('.mole');
    moles.forEach(mole => {
      mole.classList.remove('visible');
      mole.classList.remove('hit');
    });
    
    // Update UI
    startButton.textContent = 'Start New Game';
    startButton.disabled = false;
    difficultySelect.disabled = false;
    gameMessage.textContent = `Game Over! Final score: ${score}`;
    
    // Update high score
    if (score > highScore) {
      highScore = score;
      highScoreDisplay.textContent = highScore;
      localStorage.setItem('whackHighScore', highScore);
      gameMessage.textContent += ' - New High Score!';
    }
  }
  
  // Spawn moles at random intervals
  function spawnMoles() {
    const difficulty = difficultySettings[difficultySelect.value];
    
    // Clear any existing interval
    clearInterval(moleInterval);
    
    // Set new interval for spawning moles
    moleInterval = setInterval(() => {
      // Check if we should spawn a mole based on probability
      if (Math.random() < difficulty.probability) {
        const moles = document.querySelectorAll('.mole');
        const availableMoles = Array.from(moles).filter(
          mole => !mole.classList.contains('visible') && !mole.classList.contains('hit')
        );
        
        if (availableMoles.length > 0) {
          // Select random mole from available ones
          const randomMole = availableMoles[Math.floor(Math.random() * availableMoles.length)];
          
          // Show the mole
          randomMole.classList.add('visible');
          
          // Hide the mole after a set time
          setTimeout(() => {
            if (!randomMole.classList.contains('hit')) {
              randomMole.classList.remove('visible');
            }
          }, difficulty.showTime);
        }
      }
    }, 600); // Check for mole spawning every 600ms
  }
  
  // Handle whacking a mole
  function whackMole(e) {
    if (!isPlaying) return;
    
    const mole = e.currentTarget;
    
    // Check if mole is visible and not already hit
    if (mole.classList.contains('visible') && !mole.classList.contains('hit')) {
      // Register hit
      mole.classList.add('hit');
      
      // Play sound
      playSound();
      
      // Add points
      score += 10;
      updateDisplay();
      
      // Create hit effect
      createHitEffect(e);
      
      // Remove mole after animation
      setTimeout(() => {
        mole.classList.remove('visible');
        mole.classList.remove('hit');
      }, 500);
    }
  }
  
  // Create visual effect when hitting a mole
  function createHitEffect(e) {
    const hitEffect = document.createElement('div');
    hitEffect.className = 'hit-effect';
    hitEffect.textContent = '+10';
    hitEffect.style.position = 'absolute';
    hitEffect.style.left = `${e.pageX - moleContainer.getBoundingClientRect().left - 20}px`;
    hitEffect.style.top = `${e.pageY - moleContainer.getBoundingClientRect().top - 20}px`;
    hitEffect.style.color = '#4CAF50';
    hitEffect.style.fontWeight = 'bold';
    hitEffect.style.fontSize = '20px';
    hitEffect.style.pointerEvents = 'none';
    hitEffect.style.animation = 'float-up 1s forwards';
    
    moleContainer.appendChild(hitEffect);
    
    setTimeout(() => {
      moleContainer.removeChild(hitEffect);
    }, 1000);
  }
  
  // Play sound when hitting a mole
  function playSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.1;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      
      // Short duration sound
      setTimeout(() => {
        oscillator.stop();
      }, 100);
    } catch (e) {
      console.log('Sound playback failed:', e);
    }
  }
  
  // Add keyframe animation for hit effect
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-up {
      0% {
        transform: translateY(0);
        opacity: 1;
      }
      100% {
        transform: translateY(-50px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Add event listeners
  startButton.addEventListener('click', startGame);
  
  // Initialize the game
  createMoleHoles();
};

// For backward compatibility
function loadWhackAMoleGame() {
  if (window.loadWhackAMoleGameImpl) {
    window.loadWhackAMoleGameImpl();
  }
}
