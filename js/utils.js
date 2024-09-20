export function playBeep() {
  const beep = new Audio("assets/beep.wav");

  const playPromise = beep.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log("Beep played successfully.");
      })
      .catch((error) => {
        console.log("Error playing sound: ", error);
      });
  }
}

export function formatTime(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}
