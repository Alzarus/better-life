let timeRemaining = 0;
let paused = false;
let interval = null;

function startTimer() {
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    if (!paused && timeRemaining > 0) {
      timeRemaining--;
      postMessage(timeRemaining);
    }
  }, 1000);
}

onmessage = function (e) {
  if (e.data.action === "start") {
    timeRemaining = e.data.time;
    paused = false;
    startTimer();
  } else if (e.data.action === "pause") {
    paused = true;
  } else if (e.data.action === "resume") {
    paused = false;
  }
};
