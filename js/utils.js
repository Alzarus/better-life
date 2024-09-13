// Function to play the beep sound
export function playBeep() {
  const beep = new Audio("assets/beep.wav");
  beep.play().catch((error) => {
    console.log("Error playing sound: ", error);
  });
}

// Function to format time in hh:mm:ss
export function formatTime(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}
