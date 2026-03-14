// Variables globales
let score = localStorage.getItem('cookieScore') ? parseInt(localStorage.getItem('cookieScore')) : 50;
let drugStock = localStorage.getItem('drugStock') ? parseInt(localStorage.getItem('drugStock')) : 0;
let dealerStock = localStorage.getItem('dealerStock') ? parseInt(localStorage.getItem('dealerStock')) : 0;
let drugPrice = 10;
let dealerPrice = 500;
let dealerSellPrice = localStorage.getItem('dealerSellPrice') ? parseInt(localStorage.getItem('dealerSellPrice')) : 10;
let dealerBuyPrice = localStorage.getItem('dealerBuyPrice') ? parseInt(localStorage.getItem('dealerBuyPrice')) : 5;
let dealerIntervalId = null;
let policeTimeoutId = null;
const policePenalty = 1;

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

  // Désactive le bouton "Acheter Drogue" si pas assez d'argent
  const buyDrugButton = document.querySelector('.buy[data-product="drug"]');
  if (score >= drugPrice) {
    buyDrugButton.classList.remove('button-disabled');
    buyDrugButton.disabled = false;
  } else {
    buyDrugButton.classList.add('button-disabled');
    buyDrugButton.disabled = true;
  }

  // Désactive le bouton "Vendre Drogue" si pas de stock
  const sellDrugButton = document.querySelector('.sell[data-product="drug"]');
  if (drugStock > 0) {
    sellDrugButton.classList.remove('button-disabled');
    sellDrugButton.disabled = false;
  } else {
    sellDrugButton.classList.add('button-disabled');
    sellDrugButton.disabled = true;
  }

  // Désactive le bouton "Acheter Dealer" si pas assez d'argent
  const buyDealerButton = document.querySelector('.buy[data-product="dealer"]');
  if (score >= dealerPrice) {
    buyDealerButton.classList.remove('button-disabled');
    buyDealerButton.disabled = false;
  } else {
    buyDealerButton.classList.add('button-disabled');
    buyDealerButton.disabled = true;
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
    startDealerSales();
    startPoliceAlerts();
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
    if (dealerStock > 0 && drugStock > 0 && drugPrice >= dealerSellPrice) {
      const unitsToSell = Math.min(drugStock, dealerStock * 2);
      score += drugPrice * unitsToSell;
      drugStock -= unitsToSell;
      updateDisplay();
      localStorage.setItem('cookieScore', score);
      localStorage.setItem('drugStock', drugStock);
    }

    if (dealerStock > 0 && drugPrice <= dealerBuyPrice) {
      let dealersCanBuy = Math.min(dealerStock, Math.floor(score / drugPrice));
      if (dealersCanBuy > 0) {
        score -= dealersCanBuy * drugPrice;
        drugStock += dealersCanBuy;
        updateDisplay();
        localStorage.setItem('cookieScore', score);
        localStorage.setItem('drugStock', drugStock);
      }
    }
  }, 1000);
}

// Fonction pour afficher l'alerte police
function showPoliceAlert() {
  const policeAlert = document.getElementById('police-alert');
  policeAlert.style.display = 'block';

  policeTimeoutId = setTimeout(() => {
    if (dealerStock > 0) {
      dealerStock = Math.max(0, dealerStock - policePenalty);
      updateDisplay();
      localStorage.setItem('dealerStock', dealerStock);
      alert(`La police a confisqué ${policePenalty} dealer(s) !`);
    }
    policeAlert.style.display = 'none';
  }, 3000);
}

// Écouteur pour cliquer sur l'alerte police
document.getElementById('police-alert').addEventListener('click', () => {
  clearTimeout(policeTimeoutId);
  document.getElementById('police-alert').style.display = 'none';
});

// Fonction pour lancer une alerte police après un délai aléatoire
function schedulePoliceAlert() {
  if (dealerStock <= 0) return;

  const randomDelay = Math.floor(Math.random() * 20000) + 10000;
  setTimeout(() => {
    showPoliceAlert();
    schedulePoliceAlert();
  }, randomDelay);
}

// Démarrer les alertes police
function startPoliceAlerts() {
  schedulePoliceAlert();
}

// Gestion de la modale de mise à jour
window.addEventListener('load', () => {
  const modal = document.getElementById('update-modal');
  modal.style.display = 'block';

  setTimeout(() => {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 1000);
  }, 5000);

  document.getElementById('close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });
});

// Compteur pour activer/désactiver le mode debug
let debugClickCount = 0;
const debugClickThreshold = 5;
let debugModeActive = false;

// Écouteur pour activer/désactiver le mode debug
document.getElementById('score-display').addEventListener('click', () => {
  debugClickCount++;
  if (debugClickCount >= debugClickThreshold) {
    debugModeActive = !debugModeActive;
    if (debugModeActive) {
      document.getElementById('buttons-section').style.display = 'block';
      document.getElementById('score-buttons-section').style.display = 'flex';
    } else {
      document.getElementById('buttons-section').style.display = 'none';
      document.getElementById('score-buttons-section').style.display = 'none';
    }
    debugClickCount = 0;
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
  startPoliceAlerts();
}
