let score = localStorage.getItem('cookieScore') ? parseInt(localStorage.getItem('cookieScore')) : 0;
document.getElementById('score').textContent = score;

document.getElementById('cookie').addEventListener('click', () => {
  score++;
  document.getElementById('score').textContent = score;
  localStorage.setItem('cookieScore', score.toString());
});
