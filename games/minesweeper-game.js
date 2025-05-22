/**
 * Minesweeper Game Implementation for StudentBuddy
 */
// Expose the function globally so it can be called from other scripts
window.loadMinesweeperGameImpl = function() {
  const gameContainer = document.getElementById('game-container');
  
  const gameHTML = `
    <div class="minesweeper-game">
      <div class="game-header">
        <div class="mine-counter">
          <span class="icon">💣</span>
          <span id="mine-counter">10</span>
        </div>
        <button id="new-game-btn" class="btn">New Game</button>
        <div class="timer">
          <span class="icon">⏱️</span>
          <span id="timer-display">0</span>
        </div>
      </div>
      
      <div class="difficulty-selector">
        <button class="diff-btn active" data-diff="easy">Easy (9x9, 10 mines)</button>
        <button class="diff-btn" data-diff="medium">Medium (16x16, 40 mines)</button>
        <button class="diff-btn" data-diff="hard">Hard (16x30, 99 mines)</button>
      </div>
      
      <div class="game-board" id="minesweeper-board"></div>
      
      <div class="game-controls">
        <p>Left-click to reveal | Right-click to flag</p>
      </div>
    </div>
    <style>
      .minesweeper-game {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }
      
      .game-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        background: #f0f0f0;
        padding: 10px;
        border-radius: 5px;
      }
      
      .mine-counter, .timer {
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      .difficulty-selector {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
        flex-wrap: wrap;
      }
      
      .diff-btn {
        padding: 8px 12px;
        background: #e0e0e0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .diff-btn.active {
        background: #004c97;
        color: white;
      }
      
      .game-board {
        display: grid;
        gap: 1px;
        background: #ccc;
        border: 2px solid #999;
        margin: 0 auto;
      }
      
      .cell {
        width: 30px;
        height: 30px;
        background: #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        cursor: pointer;
      }
      
      .cell:hover {
        background: #ccc;
      }
      
      .cell.revealed {
        background: #f0f0f0;
        cursor: default;
      }
      
      .cell.mine {
        background: #f44336;
      }
      
      .cell.flagged {
        background: #ddd;
      }
      
      .game-controls {
        text-align: center;
        margin-top: 15px;
        color: #666;
      }
      
      @media (max-width: 600px) {
        .cell {
          width: 25px;
          height: 25px;
          font-size: 0.9em;
        }
        
        .difficulty-selector {
          flex-direction: column;
        }
      }
    </style>
  `;

  gameContainer.innerHTML = gameHTML;

  // Minesweeper Game Logic
  const board = document.getElementById('minesweeper-board');
  const newGameBtn = document.getElementById('new-game-btn');
  const mineCounter = document.getElementById('mine-counter');
  const timerDisplay = document.getElementById('timer-display');
  const diffButtons = document.querySelectorAll('.diff-btn');

  // Game configuration
  const difficulties = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 }
  };

  let currentDifficulty = 'easy';
  let gameConfig = difficulties[currentDifficulty];
  let gameState;
  let timerInterval;

  // Initialize game
  initGame();

  // Event listeners
  newGameBtn.addEventListener('click', initGame);

  diffButtons.forEach(button => {
    button.addEventListener('click', () => {
      diffButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentDifficulty = button.dataset.diff;
      gameConfig = difficulties[currentDifficulty];
      initGame();
    });
  });

  // Functions
  function initGame() {
    // Clear any existing timer
    if (timerInterval) clearInterval(timerInterval);
    
    // Initialize the game state
    gameState = {
      board: [],
      revealed: 0,
      gameOver: false,
      flaggedMines: 0,
      startTime: null
    };
    
    // Create board
    createBoard();
    
    // Set mine counter
    updateMineCounter();
    
    // Reset timer
    timerDisplay.textContent = '0';
  }

  function createBoard() {
    // Clear the board
    board.innerHTML = '';
    
    // Set grid dimensions
    board.style.gridTemplateColumns = `repeat(${gameConfig.cols}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${gameConfig.rows}, 1fr)`;
    
    // Update container width for responsiveness
    const maxWidth = Math.min(window.innerWidth - 40, gameConfig.cols * 30);
    board.style.width = `${maxWidth}px`;
    
    // Initialize the board with empty cells
    gameState.board = Array(gameConfig.rows).fill().map(() => 
      Array(gameConfig.cols).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0
      }))
    );
    
    // Generate cells in the DOM
    for (let r = 0; r < gameConfig.rows; r++) {
      for (let c = 0; c < gameConfig.cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        
        // Left click to reveal
        cell.addEventListener('click', () => revealCell(r, c));
        
        // Right click to flag
        cell.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          flagCell(r, c);
        });
        
        board.appendChild(cell);
      }
    }
  }

  function placeMines(firstRow, firstCol) {
    let minesPlaced = 0;
    
    // Ensure the first clicked cell and its neighbors are safe
    const safeZone = [];
    for (let r = Math.max(0, firstRow - 1); r <= Math.min(gameConfig.rows - 1, firstRow + 1); r++) {
      for (let c = Math.max(0, firstCol - 1); c <= Math.min(gameConfig.cols - 1, firstCol + 1); c++) {
        safeZone.push(`${r},${c}`);
      }
    }
    
    while (minesPlaced < gameConfig.mines) {
      const row = Math.floor(Math.random() * gameConfig.rows);
      const col = Math.floor(Math.random() * gameConfig.cols);
      
      // Skip if mine already placed or in safe zone
      if (gameState.board[row][col].isMine || safeZone.includes(`${row},${col}`)) continue;
      
      gameState.board[row][col].isMine = true;
      minesPlaced++;
      
      // Increment adjacent mine count for neighboring cells
      for (let r = Math.max(0, row - 1); r <= Math.min(gameConfig.rows - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(gameConfig.cols - 1, col + 1); c++) {
          if (r === row && c === col) continue;
          gameState.board[r][c].adjacentMines++;
        }
      }
    }
  }

  function revealCell(row, col) {
    // Skip if game is over or cell is already revealed or flagged
    if (gameState.gameOver || 
        gameState.board[row][col].isRevealed || 
        gameState.board[row][col].isFlagged) {
      return;
    }
    
    // Start timer on first click
    if (!gameState.startTime) {
      gameState.startTime = Date.now();
      startTimer();
      // Place mines after first click to ensure first click is safe
      placeMines(row, col);
    }
    
    // Get the cell
    const cell = gameState.board[row][col];
    
    // Reveal the cell
    cell.isRevealed = true;
    gameState.revealed++;
    
    // Update UI
    const cellElement = board.children[row * gameConfig.cols + col];
    cellElement.classList.add('revealed');
    
    // Check if it's a mine
    if (cell.isMine) {
      cellElement.textContent = '💣';
      cellElement.classList.add('mine');
      gameOver(false);
      return;
    }
    
    // Show adjacent mine count if any
    if (cell.adjacentMines > 0) {
      cellElement.textContent = cell.adjacentMines;
      
      // Set color based on number
      const colors = ['', 'blue', 'green', 'red', 'purple', 'maroon', 'turquoise', 'black', 'gray'];
      cellElement.style.color = colors[cell.adjacentMines];
    } else {
      // If it's a 0, reveal neighbors recursively
      for (let r = Math.max(0, row - 1); r <= Math.min(gameConfig.rows - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(gameConfig.cols - 1, col + 1); c++) {
          if (r === row && c === col) continue;
          if (!gameState.board[r][c].isRevealed) revealCell(r, c);
        }
      }
    }
    
    // Check if player has won
    checkWin();
  }

  function flagCell(row, col) {
    // Skip if game is over or cell is already revealed
    if (gameState.gameOver || gameState.board[row][col].isRevealed) return;
    
    const cell = gameState.board[row][col];
    const cellElement = board.children[row * gameConfig.cols + col];
    
    // Toggle flag
    cell.isFlagged = !cell.isFlagged;
    
    if (cell.isFlagged) {
      cellElement.textContent = '🚩';
      if (cell.isMine) gameState.flaggedMines++;
    } else {
      cellElement.textContent = '';
      if (cell.isMine) gameState.flaggedMines--;
    }
    
    // Update mine counter
    updateMineCounter();
    
    // Check if player has won
    checkWin();
  }

  function updateMineCounter() {
    mineCounter.textContent = gameConfig.mines - gameState.board.flat().filter(cell => cell.isFlagged).length;
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
      timerDisplay.textContent = elapsedSeconds;
    }, 1000);
  }

  function checkWin() {
    // Win condition: all non-mine cells are revealed, or all mines are flagged
    const totalCells = gameConfig.rows * gameConfig.cols;
    const revealGoal = totalCells - gameConfig.mines;
    
    if (gameState.revealed === revealGoal || gameState.flaggedMines === gameConfig.mines) {
      gameOver(true);
    }
  }

  function gameOver(isWin) {
    gameState.gameOver = true;
    clearInterval(timerInterval);
    
    // Reveal all cells
    for (let r = 0; r < gameConfig.rows; r++) {
      for (let c = 0; c < gameConfig.cols; c++) {
        const cell = gameState.board[r][c];
        const cellElement = board.children[r * gameConfig.cols + c];
        
        if (cell.isMine && !cell.isFlagged) {
          cellElement.textContent = '💣';
          cellElement.classList.add('revealed');
          if (!isWin) cellElement.classList.add('mine');
        } else if (cell.isFlagged && !cell.isMine) {
          cellElement.textContent = '❌';
          cellElement.classList.add('revealed');
        }
      }
    }
    
    // Show game result
    setTimeout(() => {
      if (isWin) {
        alert('Congratulations! You found all the mines!');
      } else {
        alert('Game over! You hit a mine.');
      }
    }, 100);
  }
};

// For backward compatibility, also define the original function
function loadMinesweeperGame() {
  window.loadMinesweeperGameImpl();
}
