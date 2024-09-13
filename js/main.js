import { playBeep, formatTime } from "./utils.js";

const statusSpan = document.getElementById("status");
const actionSpan = document.getElementById("action");
const timeSpan = document.getElementById("time");
const prompt = document.getElementById("prompt");
const pauseBtn = document.getElementById("pauseBtn");
const configureBtn = document.getElementById("configureBtn");

const sittingInput = document.getElementById("sittingTime");
const standingInput = document.getElementById("standingTime");
const walkingInput = document.getElementById("walkingTime");
const stretchingInput = document.getElementById("stretchingTime");

const times = {
  sitting: localStorage.getItem("sittingTime") || 3600,
  standing: localStorage.getItem("standingTime") || 1800,
  walking: localStorage.getItem("walkingTime") || 300,
  stretching: localStorage.getItem("stretchingTime") || 300,
};

sittingInput.value = times.sitting / 60;
standingInput.value = times.standing / 60;
walkingInput.value = times.walking / 60;
stretchingInput.value = times.stretching / 60;

const statusArray = ["Sitting", "Standing", "Walking", "Stretching"];
const actionArray = [
  "Work sitting",
  "Work standing",
  "Take a short walk",
  "Do some stretching",
];

let currentPhase = 0;
let paused = false;
let timeRemaining = times.sitting;

const worker = new Worker("js/worker.js");

function saveSettings() {
  const sittingTime = parseInt(sittingInput.value) * 60;
  const standingTime = parseInt(standingInput.value) * 60;
  const walkingTime = parseInt(walkingInput.value) * 60;
  const stretchingTime = parseInt(stretchingInput.value) * 60;

  localStorage.setItem("sittingTime", sittingTime);
  localStorage.setItem("standingTime", standingTime);
  localStorage.setItem("walkingTime", walkingTime);
  localStorage.setItem("stretchingTime", stretchingTime);

  times.sitting = sittingTime;
  times.standing = standingTime;
  times.walking = walkingTime;
  times.stretching = stretchingTime;

  updateStatus();
}

function resetSettings() {
  sittingInput.value = 60;
  standingInput.value = 30;
  walkingInput.value = 5;
  stretchingInput.value = 5;
  saveSettings();
}

function updateStatus() {
  statusSpan.textContent = statusArray[currentPhase];
  actionSpan.textContent = actionArray[currentPhase];
  timeRemaining = Object.values(times)[currentPhase];
  timeSpan.textContent = formatTime(timeRemaining);
  worker.postMessage({ action: "start", time: timeRemaining });
}

function switchPhase() {
  if (currentPhase === 2 || currentPhase === 3) {
    prompt.style.display = "block";
    return;
  }
  currentPhase = (currentPhase + 1) % statusArray.length;
  updateStatus();
}

document.getElementById("saveBtn").addEventListener("click", saveSettings);
document.getElementById("resetBtn").addEventListener("click", resetSettings);
document.getElementById("nextBtn").addEventListener("click", () => {
  prompt.style.display = "none";
  currentPhase = (currentPhase + 1) % statusArray.length;
  updateStatus();
});

document.getElementById("backBtn").addEventListener("click", () => {
  prompt.style.display = "none";
  currentPhase = (currentPhase - 1 + statusArray.length) % statusArray.length;
  updateStatus();
});

pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
  worker.postMessage({ action: paused ? "pause" : "resume" });
});

configureBtn.addEventListener("click", () => {
  const settingsDiv = document.getElementById("settings");
  settingsDiv.style.display =
    settingsDiv.style.display === "block" ? "none" : "block";
});

worker.onmessage = function (e) {
  timeRemaining = e.data;
  timeSpan.textContent = formatTime(timeRemaining);
  if (timeRemaining <= 0) {
    playBeep();
    switchPhase();
  }
};

updateStatus();
