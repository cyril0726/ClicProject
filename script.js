// Récupère le score sauvegardé ou initialise à 0
let score = localStorage.getItem('cookieScore') ? parseInt(localStorage.getItem('cookieScore')) : 0;

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
  alert("Score réinitialisé !"); // Optionnel : confirmation visuelle
});
