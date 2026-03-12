// Récupère le score sauvegardé ou initialise à 0
let score = localStorage.getItem('cookieScore') ? parseInt(localStorage.getItem('cookieScore')) : 0;
let autoIncrementActive = false;  // État du bouton auto-incrément
let autoIncrementId = null;      // Identifiant de l'intervalle

// Met à jour l'affichage du score
document.getElementById('score').textContent = score;

// Écoute les clics sur le cookie
document.getElementById('cookie').addEventListener('click', () => {
  score++;
  document.getElementById('score').textContent = score;
  localStorage.setItem('cookieScore', score.toString());
});

// Écoute les clics sur le bouton de réinitialisation
document.getElementById('reset').addEventListener('click', () => {
  score = 0;
  document.getElementById('score').textContent = score;
  localStorage.setItem('cookieScore', score.toString());
  alert("Score réinitialisé !");
});

// Écoute les clics sur le bouton d'auto-incrément
document.getElementById('auto-increment').addEventListener('click', () => {
  if (!autoIncrementActive) {
    // Active l'auto-incrément
    autoIncrementId = setInterval(() => {
      score++;
      document.getElementById('score').textContent = score;
      localStorage.setItem('cookieScore', score.toString());
    }, 1000); // 1000 ms = 1 seconde
    document.getElementById('auto-increment').style.backgroundColor = "#4CAF50"; // Vert = activé
  } else {
    // Désactive l'auto-incrément
    clearInterval(autoIncrementId);
    document.getElementById('auto-increment').style.backgroundColor = "#ff6b6b"; // Rouge = désactivé
  }
  autoIncrementActive = !autoIncrementActive; // Inverse l'état
});
