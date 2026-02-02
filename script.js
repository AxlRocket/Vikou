// Seuil de détection du secouement
const SHAKE_THRESHOLD = 15;
let lastTime = 0;
let lastX = 0,
  lastY = 0,
  lastZ = 0;

let opacity = 1.0;

function handleShake() {
  console.log("Téléphone secoué !");
  opacity -= 0.1;

  document.getElementById("op").opacity = opacity;
  // Votre code ici (vibration, animation, etc.)
}

function detectShake(event) {
  const current = event.accelerationIncludingGravity;
  const currentTime = new Date().getTime();

  // Vérifier qu'au moins 100ms se sont écoulées depuis la dernière détection
  if (currentTime - lastTime > 100) {
    const timeDiff = currentTime - lastTime;
    lastTime = currentTime;

    // Calculer la différence d'accélération
    const x = current.x || 0;
    const y = current.y || 0;
    const z = current.z || 0;

    const speed =
      (Math.abs(x + y + z - lastX - lastY - lastZ) / timeDiff) * 10000;

    if (speed > SHAKE_THRESHOLD) {
      handleShake();
    }

    lastX = x;
    lastY = y;
    lastZ = z;
  }
}

// Demander la permission (requis sur iOS 13+)
if (
  typeof DeviceMotionEvent !== "undefined" &&
  typeof DeviceMotionEvent.requestPermission === "function"
) {
  DeviceMotionEvent.requestPermission()
    .then((permissionState) => {
      if (permissionState === "granted") {
        window.addEventListener("devicemotion", detectShake);
      }
    })
    .catch(console.error);
} else {
  // Pour Android et anciennes versions iOS
  window.addEventListener("devicemotion", detectShake);
}
