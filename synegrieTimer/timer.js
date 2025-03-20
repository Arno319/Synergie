let isWorking = true;
let timer;
let minutes = 25;
let seconds = 0;
let timeLeft = minutes * 60;
let isPaused = false; // Track if the timer is paused

const timeDisplay = document.getElementById("time");
const sessionDisplay = document.getElementById("session");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const pauseButton = document.getElementById("pauseButton");

function formatTime(time) {
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

timeDisplay.textContent = formatTime(timeLeft);

function startTimer() {
  timer = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      timeDisplay.textContent = formatTime(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timer);
        if (isWorking) {
          // Switch to break session
          isWorking = false;
          sessionDisplay.textContent = "Break Time";
          timeLeft = 5 * 60; // 5 minutes break
        } else {
          // Switch to work session
          isWorking = true;
          sessionDisplay.textContent = "Work Session";
          timeLeft = 25 * 60; // 25 minutes work
        }
        startButton.style.display = "inline-block";
        stopButton.style.display = "none";
        pauseButton.style.display = "none"; // Hide Pause button after the session ends
      }
    }
  }, 1000);
  startButton.style.display = "none";
  stopButton.style.display = "inline-block";
  pauseButton.style.display = "inline-block"; // Show Pause button when timer starts
}

function stopTimer() {
  clearInterval(timer);
  timeLeft = isWorking ? 25 * 60 : 5 * 60; // Reset to the current session time
  timeDisplay.textContent = formatTime(timeLeft);
  sessionDisplay.textContent = isWorking ? "Work Session" : "Break Time"; // Update session display
  startButton.style.display = "inline-block";
  stopButton.style.display = "none";
  pauseButton.style.display = "none"; // Hide Pause button when timer is stopped
  isPaused = false; // Reset paused state when stopped
}

function pauseTimer() {
  isPaused = true; // Set the timer to paused state
  pauseButton.textContent = "Resume"; // Change the button to "Resume"
}

function resumeTimer() {
  isPaused = false; // Set the timer to running state
  pauseButton.textContent = "Pause"; // Change the button back to "Pause"
}

startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
pauseButton.addEventListener("click", () => {
  if (isPaused) {
    resumeTimer(); // Resume the timer if it was paused
  } else {
    pauseTimer(); // Pause the timer if it's running
  }
});