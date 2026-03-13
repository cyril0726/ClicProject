// Variables globales
let score = localStorage.getItem('cookieScore') ? parseInt(localStorage.getItem('cookieScore')) : 50;
let drugStock = localStorage.getItem('drugStock') ? parseInt(localStorage.getItem('drugStock')) : 0;
let dealerStock = localStorage.getItem('dealerStock') ? parseInt(localStorage.getItem('dealerStock')) : 0;
let drugPrice = 10;
let dealerPrice = 500;
let dealerSellPrice = localStorage.getItem('dealerSellPrice') ? parseInt(localStorage.getItem('dealerSellPrice')) : 10;
let dealerBuyPrice = localStorage.getItem('dealerBuyPrice') ? parseInt(localStorage.getItem('dealerBuyPrice')) : 5;
let dealerIntervalId = null;

// Mise à jour de l'affichage initial
function updateDisplay() {
  document.getElementById('score').textContent = score;
  document.getElementById('drug-stock').textContent = drugStock;
  document.getElementById('dealer-stock').textContent = dealerStock;
  document.querySelector('#drug-price span').textContent = drugPrice;
  document.querySelector('#dealer-price span').textContent = dealerPrice;
  document.getElementById('dealer-sell-price').value = dealerSellPrice;
  document.getElementById('dealer-buy-price').value = dealerBuyPrice;

  // Déblocage de la section Équipe à 150€
  if (score >= 150) {
    document.getElementById('team-section').style.display = 'block';
  }
}

// Fonction pour générer un prix aléatoire
function getRandomPrice(basePrice) {
  return Math.floor(Math.random() * 10) + basePrice;
}

// Mise à jour du prix aléatoire toutes les 5 secondes
setInterval(() => {
  drugPrice = getRandomPrice(10);
  document.querySelector('#drug-price span').textContent = drugPrice;
}, 5000);

// Écouteur pour acheter de la drogue
document.querySelector('.buy[data-product="drug"]').addEventListener('click', () => {
  if (score >= drugPrice) {
    score -= drugPrice;
    drugStock++;
    updateDisplay();
    localStorage.setItem('cookieScore', score);
    localStorage.setItem('drugStock', drugStock);
  }
});

// Écouteur pour vendre de la drogue
document.querySelector('.sell[data-product="drug"]').addEventListener('click', () => {
  if (drugStock > 0) {
    score += drugPrice;
    drugStock--;
    updateDisplay();
    localStorage.setItem('cookieScore', score);
    localStorage.setItem('drugStock', drugStock);
  }
});

// Écouteur pour acheter un dealer
document.querySelector('.buy[data-product="dealer"]').addEventListener('click', () => {
  if (score >= dealerPrice) {
    score -= dealerPrice;
    dealerStock++;
    updateDisplay();
    localStorage.setItem('cookieScore', score);
    localStorage.setItem('dealerStock', dealerStock);
    startDealerSales(); // Active les ventes/achats automatiques
  }
});

// Écouteur pour le champ de prix de vente des dealers
document.getElementById('dealer-sell-price').addEventListener('change', (e) => {
  dealerSellPrice = parseInt(e.target.value);
  localStorage.setItem('dealerSellPrice', dealerSellPrice);
});

// Écouteur pour le champ de prix d'achat des dealers
document.getElementById('dealer-buy-price').addEventListener('change', (e) => {
  dealerBuyPrice = parseInt(e.target.value);
  localStorage.setItem('dealerBuyPrice', dealerBuyPrice);
});

// Fonction pour démarrer les ventes/achats automatiques des dealers
function startDealerSales() {
  if (dealerIntervalId) {
    clearInterval(dealerIntervalId);
  }
  dealerIntervalId = setInterval(() => {
    // Vente automatique si le prix est atteint (2 unités par dealer, mais vend tout le stock disponible)
    if (dealerStock > 0 && drugStock > 0 && drugPrice >= dealerSellPrice) {
      const unitsToSell = Math.min(drugStock, dealerStock * 2); // Vendre jusqu'à dealerStock * 2, ou tout le stock disponible
      score += drugPrice * unitsToSell;
      drugStock -= unitsToSell;
      updateDisplay();
      localStorage.setItem('cookieScore', score);
      localStorage.setItem('drugStock', drugStock);
    }

    // Achat automatique si le prix est bas et qu'il y a assez d'argent (1 unité par dealer)
    if (dealerStock > 0 && score >= dealerStock * drugPrice && drugPrice <= dealerBuyPrice) {
      score -= dealerStock * drugPrice;
      drugStock += dealerStock;
      updateDisplay();
      localStorage.setItem('cookieScore', score);
      localStorage.setItem('drugStock', drugStock);
    }
  }, 1000); // Toutes les secondes
}

// Compteur pour activer/désactiver le mode debug
let debugClickCount = 0;
const debugClickThreshold = 5;
let debugModeActive = false;

// Écouteur pour activer/désactiver le mode debug
document.getElementById('score-display').addEventListener('click', () => {
  debugClickCount++;
  if (debugClickCount >= debugClickThreshold) {
    debugModeActive = !debugModeActive; // Inverse l'état du mode debug
    if (debugModeActive) {
      document.getElementById('buttons-section').style.display = 'block';
      document.getElementById('score-buttons-section').style.display = 'flex';
    } else {
      document.getElementById('buttons-section').style.display = 'none';
      document.getElementById('score-buttons-section').style.display = 'none';
    }
    debugClickCount = 0; // Réinitialise le compteur
  }
});

// Écouteurs pour les boutons +10, +100, +1000
document.getElementById('add-10').addEventListener('click', () => {
  score += 10;
  updateDisplay();
  localStorage.setItem('cookieScore', score);
});

document.getElementById('add-100').addEventListener('click', () => {
  score += 100;
  updateDisplay();
  localStorage.setItem('cookieScore', score);
});

document.getElementById('add-1000').addEventListener('click', () => {
  score += 1000;
  updateDisplay();
  localStorage.setItem('cookieScore', score);
});

// Écouteur pour le bouton de réinitialisation
document.getElementById('reset').addEventListener('click', () => {
  score = 50;
  drugStock = 0;
  dealerStock = 0;
  updateDisplay();
  localStorage.setItem('cookieScore', score);
  localStorage.setItem('drugStock', drugStock);
  localStorage.setItem('dealerStock', dealerStock);

  // Masquer les sections de debug et Équipe
  document.getElementById('team-section').style.display = 'none';
  document.getElementById('buttons-section').style.display = 'none';
  document.getElementById('score-buttons-section').style.display = 'none';
  debugModeActive = false;

  alert("Score réinitialisé !");
  if (dealerIntervalId) {
    clearInterval(dealerIntervalId);
    dealerIntervalId = null;
  }
});

// Initialisation
updateDisplay();
if (dealerStock > 0) {
  startDealerSales();
}
