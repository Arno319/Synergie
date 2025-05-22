/**
 * Flappy Bird Game Implementation for StudentBuddy
 */
window.loadFlappyBirdGameImpl = function() {
  const gameContainer = document.getElementById('game-container');
  
  const gameHTML = `
    <div class="flappy-bird-game">
      <div class="game-header">
        <div class="score-section">
          <div>Score: <span id="flappy-score">0</span></div>
          <div>Best: <span id="flappy-best">0</span></div>
        </div>
        <button id="start-flappy" class="btn">Start Game</button>
      </div>
      
      <div class="game-area">
        <canvas id="flappy-canvas" width="320" height="480"></canvas>
        <div id="game-overlay" class="game-overlay">
          <div class="message">Press Start or tap to begin</div>
        </div>
      </div>
      
      <div class="game-instructions">
        <p>Tap the screen or press Spacebar to make the bird fly</p>
        <p>Avoid the pipes and try to go as far as possible!</p>
      </div>
    </div>
    <style>
      .flappy-bird-game {
        max-width: 480px;
        margin: 0 auto;
        padding: 20px;
        user-select: none;
      }
      
      .game-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .score-section {
        font-size: 18px;
        font-weight: bold;
      }
      
      .game-area {
        position: relative;
        background-color: #4EC0CA;
        overflow: hidden;
        border-radius: 5px;
        margin-bottom: 15px;
      }
      
      #flappy-canvas {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 5px;
        background-color: #4EC0CA;
      }
      
      .game-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 24px;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
      }
      
      .game-overlay.hidden {
        display: none;
      }
      
      .game-instructions {
        text-align: center;
        color: #666;
        font-size: 14px;
        line-height: 1.4;
      }
      
      @media (max-width: 480px) {
        .flappy-bird-game {
          padding: 10px;
        }
      }
    </style>
  `;

  gameContainer.innerHTML = gameHTML;

  // DOM Elements
  const canvas = document.getElementById('flappy-canvas');
  const ctx = canvas.getContext('2d');
  const scoreDisplay = document.getElementById('flappy-score');
  const bestScoreDisplay = document.getElementById('flappy-best');
  const startButton = document.getElementById('start-flappy');
  const gameOverlay = document.getElementById('game-overlay');
  
  // Game variables
  let score = 0;
  let bestScore = localStorage.getItem('flappyBestScore') || 0;
  let frames = 0;
  let isPlaying = false;
  let animationId = null;
  let lastTime = 0;
  let deltaTime = 0;
  
  // Display best score
  bestScoreDisplay.textContent = bestScore;
  
  // Game settings
  const gravity = 0.5;
  const jumpStrength = -8;
  const pipeWidth = 60;
  const pipeGap = 120;
  const pipeSpawnRate = 100; // frames
  const parallaxSpeed = 0.5; // for clouds
  
  // Images
  const birdImage = new Image();
  const pipeImage = new Image();
  const backgroundImage = new Image();
  const groundImage = new Image();
  
  // Create SVG data URLs for images
  birdImage.src = createBirdSVG();
  pipeImage.src = createPipeSVG();
  backgroundImage.src = createBackgroundSVG();
  groundImage.src = createGroundSVG();
  
  // Wait for images to load
  const imagesToLoad = [birdImage, pipeImage, backgroundImage, groundImage];
  let imagesLoaded = 0;
  
  imagesToLoad.forEach(img => {
    img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === imagesToLoad.length) {
        // All images loaded, ready to start
        drawBackground();
        drawGround();
      }
    };
  });
  
  // Create SVG data URLs
  function createBirdSVG() {
    const birdColors = ['#FFDE59', '#FF5757', '#7ED957']; // Yellow, Red, Green
    const accentColors = ['#FF914D', '#B02E2E', '#389D1A'];
    
    // Choose random color
    const colorIndex = Math.floor(Math.random() * birdColors.length);
    
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30">
      <ellipse cx="20" cy="15" rx="18" ry="13" fill="${birdColors[colorIndex]}"/>
      <ellipse cx="30" cy="12" rx="5" ry="4" fill="white"/>
      <circle cx="32" cy="12" r="2" fill="black"/>
      <path d="M10 12 Q15 8 13 18" fill="${accentColors[colorIndex]}"/>
      <path d="M26 20 L35 15 L34 19 Z" fill="${accentColors[colorIndex]}"/>
    </svg>`;
  }
  
  function createPipeSVG() {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 300">
      <rect width="60" height="300" fill="%2373BE2E"/>
      <rect width="70" height="15" x="-5" fill="%2352A51D"/>
      <rect width="70" height="15" x="-5" y="285" fill="%2352A51D"/>
    </svg>`;
  }
  
  function createBackgroundSVG() {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 480">
      <rect width="320" height="480" fill="%234EC0CA"/>
      <ellipse cx="50" cy="90" rx="25" ry="20" fill="white" opacity="0.8"/>
      <ellipse cx="65" cy="90" rx="25" ry="20" fill="white" opacity="0.8"/>
      <ellipse cx="80" cy="90" rx="20" ry="15" fill="white" opacity="0.8"/>
      <ellipse cx="250" cy="70" rx="25" ry="20" fill="white" opacity="0.8"/>
      <ellipse cx="265" cy="70" rx="25" ry="20" fill="white" opacity="0.8"/>
      <ellipse cx="280" cy="70" rx="20" ry="15" fill="white" opacity="0.8"/>
    </svg>`;
  }
  
  function createGroundSVG() {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80">
      <rect width="320" height="80" fill="%23DED895"/>
      <rect width="320" height="15" fill="%2373BE2E"/>
      <path d="M0 15 L15 25 L30 15 L45 25 L60 15 L75 25 L90 15 L105 25 L120 15 L135 25 L150 15 L165 25 L180 15 L195 25 L210 15 L225 25 L240 15 L255 25 L270 15 L285 25 L300 15 L315 25 L320 15" stroke="%2352A51D" stroke-width="2" fill="none"/>
    </svg>`;
  }
  
  // Game objects
  const bird = {
    x: 80,
    y: 240,
    width: 36,
    height: 26,
    velocity: 0,
    jumpStrength: jumpStrength,
    gravity: gravity,
    rotation: 0,
    
    update() {
      // Apply gravity
      this.velocity += this.gravity;
      
      // Update position
      this.y += this.velocity;
      
      // Update rotation based on velocity (for animation)
      this.rotation = Math.min(Math.PI/4, Math.max(-Math.PI/4, this.velocity * 0.04));
      
      // Check ground collision
      if (this.y + this.height/2 > canvas.height - 80) {
        this.y = canvas.height - 80 - this.height/2;
        gameOver();
      }
      
      // Check ceiling collision
      if (this.y - this.height/2 < 0) {
        this.y = this.height/2;
        this.velocity = 0;
      }
    },
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.drawImage(
        birdImage, 
        -this.width/2, 
        -this.height/2, 
        this.width, 
        this.height
      );
      ctx.restore();
    },
    
    jump() {
      this.velocity = this.jumpStrength;
      playSound('jump');
    },
    
    reset() {
      this.y = 240;
      this.velocity = 0;
      this.rotation = 0;
    }
  };
  
  const pipes = {
    list: [],
    speed: 2,
    
    update() {
      // Add new pipes
      if (frames % pipeSpawnRate === 0) {
        // Calculate random height for top pipe
        const minHeight = 80;
        const maxHeight = canvas.height - pipeGap - minHeight - 80; // Subtract ground height
        const height = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
        
        this.list.push({
          x: canvas.width,
          topHeight: height,
          bottomY: height + pipeGap,
          scored: false
        });
      }
      
      // Update existing pipes
      for (let i = 0; i < this.list.length; i++) {
        const pipe = this.list[i];
        
        // Move pipe
        pipe.x -= this.speed;
        
        // Check if bird has passed pipe
        if (!pipe.scored && pipe.x + pipeWidth < bird.x) {
          score++;
          pipe.scored = true;
          scoreDisplay.textContent = score;
          playSound('point');
        }
        
        // Check collision with bird
        if (this.checkCollision(pipe)) {
          gameOver();
          return;
        }
        
        // Remove pipes that went off screen
        if (pipe.x + pipeWidth < 0) {
          this.list.splice(i, 1);
          i--;
        }
      }
    },
    
    draw() {
      this.list.forEach(pipe => {
        // Draw top pipe (upside down)
        ctx.save();
        ctx.translate(pipe.x + pipeWidth/2, pipe.topHeight);
        ctx.rotate(Math.PI);
        ctx.drawImage(
          pipeImage,
          -pipeWidth/2,
          0,
          pipeWidth,
          pipe.topHeight
        );
        ctx.restore();
        
        // Draw bottom pipe
        ctx.drawImage(
          pipeImage,
          pipe.x,
          pipe.bottomY,
          pipeWidth,
          canvas.height - pipe.bottomY
        );
      });
    },
    
    checkCollision(pipe) {
      // Get bird bounds
      const birdLeft = bird.x - bird.width/2;
      const birdRight = bird.x + bird.width/2;
      const birdTop = bird.y - bird.height/2;
      const birdBottom = bird.y + bird.height/2;
      
      // Get pipe bounds
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + pipeWidth;
      const topPipeBottom = pipe.topHeight;
      const bottomPipeTop = pipe.bottomY;
      
      // Check horizontal overlap
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check vertical overlap with either pipe
        if (birdTop < topPipeBottom || birdBottom > bottomPipeTop) {
          return true;
        }
      }
      
      return false;
    },
    
    reset() {
      this.list = [];
    }
  };
  
  const ground = {
    x: 0,
    y: canvas.height - 80,
    height: 80,
    speed: 2,
    
    update() {
      this.x = (this.x - this.speed) % canvas.width;
      if (this.x > 0) {
        this.x -= canvas.width;
      }
    },
    
    draw() {
      // Draw ground with parallax scrolling
      ctx.drawImage(groundImage, this.x, this.y, canvas.width, this.height);
      ctx.drawImage(groundImage, this.x + canvas.width, this.y, canvas.width, this.height);
    }
  };
  
  // Game functions
  function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }
  
  function drawGround() {
    ground.draw();
  }
  
  function playSound(type) {
    // Simple sound effects
    const sounds = {
      jump: '440,0.05,square',
      point: '660,0.1,sine',
      hit: '220,0.2,sawtooth'
    };
    
    if (!sounds[type]) return;
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      const [frequency, duration, waveform] = sounds[type].split(',');
      
      oscillator.type = waveform;
      oscillator.frequency.value = frequency;
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, duration * 1000);
    } catch (e) {
      console.log('Sound playback failed:', e);
    }
  }
  
  function update(time = 0) {
    // Calculate delta time for smooth animation
    deltaTime = time - lastTime;
    lastTime = time;
    
    if (!isPlaying) return;
    
    // Update game objects
    bird.update();
    pipes.update();
    ground.update();
    
    // Increase frame counter
    frames++;
    
    // Draw game state
    drawGameState();
    
    // Request next frame
    animationId = requestAnimationFrame(update);
  }
  
  function drawGameState() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    // Draw pipes
    pipes.draw();
    
    // Draw bird
    bird.draw();
    
    // Draw ground
    drawGround();
  }
  
  function startGame() {
    // Reset game state
    bird.reset();
    pipes.reset();
    score = 0;
    frames = 0;
    isPlaying = true;
    
    // Update UI
    scoreDisplay.textContent = score;
    startButton.textContent = 'Restart';
    gameOverlay.classList.add('hidden');
    
    // Start game loop
    lastTime = 0;
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    animationId = requestAnimationFrame(update);
  }
  
  function gameOver() {
    isPlaying = false;
    
    // Cancel animation frame
    cancelAnimationFrame(animationId);
    
    // Play hit sound
    playSound('hit');
    
    // Update best score
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem('flappyBestScore', bestScore);
      bestScoreDisplay.textContent = bestScore;
    }
    
    // Show game over overlay
    gameOverlay.classList.remove('hidden');
    gameOverlay.querySelector('.message').textContent = 'Game Over! Tap to restart';
    
    // Start button text
    startButton.textContent = 'Play Again';
  }
  
  // Event listeners
  startButton.addEventListener('click', function() {
    startGame();
  });
  
  canvas.addEventListener('click', function() {
    if (isPlaying) {
      bird.jump();
    } else {
      startGame();
    }
  });
  
  document.addEventListener('keydown', function(e) {
    // Prevent scrolling with space
    if (e.code === 'Space') {
      e.preventDefault();
      
      if (isPlaying) {
        bird.jump();
      } else {
        startGame();
      }
    }
  });
  
  // Initialize by drawing the static elements
  drawBackground();
  drawGround();
  
  // For mobile devices
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    if (isPlaying) {
      bird.jump();
    } else {
      startGame();
    }
  }, { passive: false });
};

// For backward compatibility
function loadFlappyBirdGame() {
  if (window.loadFlappyBirdGameImpl) {
    window.loadFlappyBirdGameImpl();
  }
}
