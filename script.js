const SHAKE_THRESHOLD = 30;
let lastTime = 0;
let lastX = 0,
  lastY = 0,
  lastZ = 0;
let isListening = false;

let tt = 1.0;
let qq = 0.0;

function handleShake() {
  document.getElementById("status").textContent =
    "Téléphone secoué ! " + new Date().toLocaleTimeString();
  console.log("SHAKE DETECTED!");

  console.log("Téléphone secoué !");
  tt = tt - 0.05;
  qq = qq + 0.05;

  if (tt >= 0) document.getElementById("op").style.opacity = tt;
  if (qq <= 1) document.getElementById("question").style.opacity = qq;
}

document.getElementById("container").addEventListener("click", () => {
  if (tt <= 0.15) {
    document.getElementById("container").classList.toggle("flipped");
  }
  //document.getElementById("container").classList.toggle("flipped");
});

function detectShake(event) {
  const current = event.accelerationIncludingGravity;

  // Vérifier que les données sont valides
  if (
    !current ||
    (current.x === null && current.y === null && current.z === null)
  ) {
    console.log("Pas de données d'accélération");
    return;
  }

  const currentTime = new Date().getTime();

  if (currentTime - lastTime > 100) {
    const timeDiff = currentTime - lastTime;
    lastTime = currentTime;

    const x = current.x || 0;
    const y = current.y || 0;
    const z = current.z || 0;

    const speed =
      (Math.abs(x + y + z - lastX - lastY - lastZ) / timeDiff) * 10000;

    console.log("Speed:", speed); // Pour déboguer

    if (speed > SHAKE_THRESHOLD) {
      handleShake();
    }

    lastX = x;
    lastY = y;
    lastZ = z;
  }
}

// Fonction pour "réveiller" les capteurs
function wakeUpSensors() {
  console.log("Réveil des capteurs...");
  // Créer un faux événement tactile pour réveiller les capteurs
  const dummyListener = (e) => {
    console.log("Capteur réveillé", e.accelerationIncludingGravity);
  };

  window.addEventListener("devicemotion", dummyListener, { once: true });

  // Attendre un peu puis activer le vrai listener
  setTimeout(() => {
    window.removeEventListener("devicemotion", dummyListener);
    window.addEventListener("devicemotion", detectShake);
    isListening = true;
    console.log("Détection active");
  }, 100);
}

document.getElementById("activateBtn").addEventListener("click", async () => {
  console.log("Bouton cliqué");

  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    try {
      const permission = await DeviceMotionEvent.requestPermission();
      console.log("Permission:", permission);

      if (permission === "granted") {
        wakeUpSensors(); // Utiliser la fonction de réveil
        document.getElementById("popup").style.display = "none";
        document.getElementById("container").style.display = "block";
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  } else {
    wakeUpSensors();
    //document.getElementById("activateBtn").style.display = "none";
  }
});

// Seuil de détection du secouement
/*const SHAKE_THRESHOLD = 15;
let lastTime = 0;
let lastX = 0,
  lastY = 0,
  lastZ = 0;

let tt = 1.0;

document.getElementById("btnTest").addEventListener("click", changeOpactity);

function changeOpactity() {
  console.log("changeOpacity");

  tt = tt - 0.05;

  document.getElementById("op").style.opacity = tt;

  /*if (document.getElementById("op").opacity > 0)
    document.getElementById("op").style.opacity = opacity;*/
/*}

function handleShake() {
  console.log("Téléphone secoué !");
  tt = tt - 0.05;

  if (document.getElementById("op").style.opacity > 0)
    document.getElementById("op").style.opacity = tt;

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

document.getElementById("activateBtn").addEventListener("click", async () => {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    // iOS 13+
    try {
      const permission = await DeviceMotionEvent.requestPermission();
      if (permission === "granted") {
        window.addEventListener("devicemotion", detectShake);
        document.getElementById("status").textContent = "Détection activée !";
        document.getElementById("activateBtn").style.display = "none";
      } else {
        document.getElementById("status").textContent = "Permission refusée";
      }
    } catch (error) {
      document.getElementById("status").textContent = "Erreur : " + error;
    }
  } else {
    // Android et anciennes versions iOS
    window.addEventListener("devicemotion", detectShake);
    document.getElementById("status").textContent = "Détection activée !";
    document.getElementById("activateBtn").style.display = "none";
  }
});*/
