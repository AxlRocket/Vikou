// Seuil de détection du secouement
const SHAKE_THRESHOLD = 15;
let lastTime = 0;
let lastX = 0,
  lastY = 0,
  lastZ = 0;

let tt = 1.0;

document.getElementById("btnTest").addEventListener("click", changeOpactity);

function changeOpactity() {
  console.log("changeOpacity");

  tt = tt - 0.1;

  document.getElementById("op").style.opacity = tt;

  /*if (document.getElementById("op").opacity > 0)
    document.getElementById("op").style.opacity = opacity;*/
}

function handleShake() {
  console.log("Téléphone secoué !");
  opacity -= 0.1;

  if (document.getElementById("op").opacity > 0)
    document.getElementById("op").style.opacity = opacity;

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

document.getElementById('activateBtn').addEventListener('click', async () => {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        // iOS 13+
        try {
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('devicemotion', detectShake);
            document.getElementById('status').textContent = 'Détection activée !';
            document.getElementById('activateBtn').style.display = 'none';
          } else {
            document.getElementById('status').textContent = 'Permission refusée';
          }
        } catch (error) {
          document.getElementById('status').textContent = 'Erreur : ' + error;
        }
      } else {
        // Android et anciennes versions iOS
        window.addEventListener('devicemotion', detectShake);
        document.getElementById('status').textContent = 'Détection activée !';
        document.getElementById('activateBtn').style.display = 'none';
      }
    });
