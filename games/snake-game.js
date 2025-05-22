/**
 * Snake Game Implementation for StudentBuddy
 */
function loadSnakeGame() {
  const gameHTML = `
    <div class="snake-game">
      <div class="game-stats">
        <div>Score: <span id="snake-score">0</span></div>
        <div>High Score: <span id="snake-high-score">0</span></div>
      </div>
      <canvas id="snake-canvas" width="400" height="400"></canvas>
      <div class="game-controls">
        <div class="controls-info">
          <p>Use arrow keys to control the snake</p>
          <button id="snake-start" class="btn">Start Game</button>
        </div>
      </div>
    </div>
    <style>
      .snake-game {
        padding: 20px;
        text-align: center;
      }
      .game-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;
        font-weight: bold;
      }
      #snake-canvas {
        border: 2px solid #004c97;
        background-color: #f5f9fc;
        margin: 0 auto;
      }
      .game-controls {
        margin-top: 20px;
      }
      .controls-info {
        margin-bottom: 10px;
        color: #666;
      }
      @media (max-width: 500px) {
        #snake-canvas {
          width: 100%;
          height: auto;
        }
      }
    </style>
  `;

  gameContainer.innerHTML = gameHTML;

  // Snake Game Logic
  const canvas = document.getElementById("snake-canvas");
  const ctx = canvas.getContext("2d");
  const scoreDisplay = document.getElementById("snake-score");
  const highScoreDisplay = document.getElementById("snake-high-score");
  const startButton = document.getElementById("snake-start");

  // Game variables
  let snake = [];
  let food = {};
  let gridSize = 20;
  let direction = "right";
  let newDirection = "right";
  let gameInterval;
  let gameSpeed = 130;
  let score = 0;
  let highScore = localStorage.getItem("snakeHighScore") || 0;
  let gameRunning = false;

  // Initialize the game
  function initGame() {
    // Reset variables
    snake = [
      { x: 5 * gridSize, y: 10 * gridSize },
      { x: 4 * gridSize, y: 10 * gridSize },
      { x: 3 * gridSize, y: 10 * gridSize },
    ];
    score = 0;
    direction = "right";
    newDirection = "right";

    // Create initial food
    createFood();

    // Display scores
    scoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;

    // Start the game loop
    if (gameInterval) clearInterval(gameInterval);
    gameRunning = true;
    gameInterval = setInterval(gameLoop, gameSpeed);
  }

  // Create food at random position
  function createFood() {
    // Generate random coordinates (avoiding snake body)
    let foodX, foodY;
    let validPosition = false;

    while (!validPosition) {
      foodX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
      foodY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;

      // Check if food overlaps with snake
      validPosition = true;
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === foodX && snake[i].y === foodY) {
          validPosition = false;
          break;
        }
      }
    }

    food = { x: foodX, y: foodY };
  }

  // Main game loop
  function gameLoop() {
    // Update snake position
    updateSnake();

    // Check for collisions and game over
    if (checkCollisions()) {
      endGame();
      return;
    }

    // Check if snake ate food
    checkFood();

    // Draw everything
    drawGame();
  }

  // Update snake position
  function updateSnake() {
    // Set current direction from the new direction
    direction = newDirection;

    // Calculate new head position
    const head = { x: snake[0].x, y: snake[0].y };

    // Move head based on direction
    switch (direction) {
      case "up":
        head.y -= gridSize;
        break;
      case "down":
        head.y += gridSize;
        break;
      case "left":
        head.x -= gridSize;
        break;
      case "right":
        head.x += gridSize;
        break;
    }

    // Add new head to front of snake
    snake.unshift(head);

    // Remove tail unless snake ate food (handled in checkFood)
    if (!checkFood()) {
      snake.pop();
    }
  }

  // Check for collisions with walls or self
  function checkCollisions() {
    const head = snake[0];

    // Check wall collisions
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= canvas.width ||
      head.y >= canvas.height
    ) {
      return true;
    }

    // Check self collisions (skip the head)
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }

    return false;
  }

  // Check if snake ate food
  function checkFood() {
    const head = snake[0];

    if (head.x === food.x && head.y === food.y) {
      // Increase score
      score += 10;
      scoreDisplay.textContent = score;

      // Update high score if needed
      if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
        localStorage.setItem("snakeHighScore", highScore);
      }

      // Create new food
      createFood();

      // Make game slightly faster every 5 food items
      if (score % 50 === 0 && gameSpeed > 50) {
        clearInterval(gameInterval);
        gameSpeed -= 10;
        gameInterval = setInterval(gameLoop, gameSpeed);
      }

      return true;
    }

    return false;
  }

  // Draw the game elements
  function drawGame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Draw head in a different color
        ctx.fillStyle = "#e6004d";
      } else {
        // Draw body
        ctx.fillStyle = "#004c97";
      }

      ctx.fillRect(segment.x, segment.y, gridSize - 1, gridSize - 1);
    });

    // Draw food
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(food.x, food.y, gridSize - 1, gridSize - 1);
  }

  // End the game
  function endGame() {
    clearInterval(gameInterval);
    gameRunning = false;
    startButton.textContent = "Play Again";
    alert(`Game Over! Your score: ${score}`);
  }

  // Handle keyboard controls
  function handleKeydown(e) {
    if (!gameRunning) return;

    // Update direction based on arrow keys
    // Prevent 180-degree turns (cannot go directly opposite to current direction)
    switch (e.key) {
      case "ArrowUp":
        if (direction !== "down") newDirection = "up";
        break;
      case "ArrowDown":
        if (direction !== "up") newDirection = "down";
        break;
      case "ArrowLeft":
        if (direction !== "right") newDirection = "left";
        break;
      case "ArrowRight":
        if (direction !== "left") newDirection = "right";
        break;
    }

    // Prevent default scrolling behavior with arrow keys
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
    }
  }

  // Add event listener for keyboard controls
  document.addEventListener("keydown", handleKeydown);

  // Start button click handler
  startButton.addEventListener("click", function () {
    if (gameRunning) {
      clearInterval(gameInterval);
      gameRunning = false;
      startButton.textContent = "Start Game";
    } else {
      initGame();
      startButton.textContent = "Pause";
    }
  });

  // Initial setup
  highScoreDisplay.textContent = highScore;
  drawGame();
}
