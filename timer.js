let countdownTime = 0; // Default countdown time in seconds
let timerInterval;

function setTimer() {
  const inputTime = document.getElementById('set-time').value;

  // Validate that the input is a positive number
  if (inputTime > 0) {
    countdownTime = parseInt(inputTime, 10);
    document.getElementById('countdown').textContent = formatTime(countdownTime);
    document.getElementById('progress-bar').style.width = '100%';
    resetPointer();
  } else {
    alert("Please enter a valid time greater than 0 seconds.");
    document.getElementById('set-time').value = ''; // Reset input
  }
}

function startTimer() {
  if (countdownTime <= 0) {
    alert("Please set the timer first.");
    return;
  }

  clearInterval(timerInterval); // Clear any previous timer
  const progressBar = document.getElementById('progress-bar');
  const pointer = document.getElementById('pointer');
  const countdownDisplay = document.getElementById('countdown');
  const unicodeElement = document.getElementById('unicode-display');
  let currentTime = countdownTime;

  timerInterval = setInterval(() => {
    // If it's the last second, show the Unicode and animate it
    if (currentTime === 1) {
      unicodeElement.style.opacity = '1'; // Show the Unicode
      unicodeElement.classList.add('zoom-in'); // Apply zoom-in animation
    }

    // Update digital clock
    if (currentTime > 1) {
      countdownDisplay.textContent = formatTime(currentTime);
    } else {
      countdownDisplay.textContent = ''; // Clear countdown
    }

    // Update progress bar and pointer position
    const progressPercentage = (currentTime / countdownTime) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    // Update pointer rotation (clock-style effect)
    const pointerAngle = (1 - currentTime / countdownTime) * 180; // Rotate from 0 to 180 degrees
    pointer.style.transform = `rotate(${pointerAngle}deg)`;

    // Decrement time
    currentTime--;

    // Stop timer when it reaches 0
    if (currentTime < 0) {
      clearInterval(timerInterval);
      progressBar.style.width = '0%'; // Reset the bar
      resetPointer(); // Reset pointer
    }
  }, 1000); // Update every second
}

function formatTime(seconds) {
  if (seconds <= 59) {
    return String(seconds).padStart(2, '0'); // Two-digit format
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`; // Four-digit format
  }
}

function resetPointer() {
  const pointer = document.getElementById('pointer');
  pointer.style.transform = 'rotate(0deg)'; // Reset to initial position

  const unicodeElement = document.getElementById('unicode-display');
  unicodeElement.style.opacity = '0'; // Hide the Unicode initially
  unicodeElement.classList.remove('zoom-in'); // Reset animation
}
