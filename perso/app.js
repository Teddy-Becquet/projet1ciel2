// Configuration
const WS_URL = 'ws://172.29.18.254:3000';
const API_URL = 'http://172.29.18.254';

// État global
let ws = null;
let currentState = {
    status: 'OFF',
    connected: false
};

// ============= WEBSOCKET =============

function connectWebSocket() {
    console.log('Connexion WebSocket...');
    
    ws = new WebSocket(WS_URL);
    
    ws.onopen = () => {
        console.log('✅ WebSocket connecté');
        addHistory('Connecté au serveur');
    };
    
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('📨 Message reçu:', message);
        
        if (message.type === 'state') {
            updateState(message.data);
        } else if (message.type === 'connection') {
            updateArduinoConnection(message.connected);
        }
    };
    
    ws.onerror = (error) => {
        console.error('❌ Erreur WebSocket:', error);
        addHistory('Erreur de connexion', 'error');
    };
    
    ws.onclose = () => {
        console.log('🔌 WebSocket fermé, reconnexion dans 3s...');
        updateConnectionStatus(false);
        setTimeout(connectWebSocket, 3000);
    };
}

// ============= FONCTIONS UI =============

function updateState(data) {
    currentState = data;
    
    const statusIcon = document.getElementById('statusIcon');
    const statusTitle = document.getElementById('statusTitle');
    const statusSubtitle = document.getElementById('statusSubtitle');
    const infoState = document.getElementById('infoState');
    const infoLastUpdate = document.getElementById('infoLastUpdate');
    
    if (data.status === 'ON') {
        statusIcon.textContent = '🔊';
        statusIcon.classList.add('active');
        statusTitle.textContent = 'Alarme Activée';
        statusTitle.style.color = '#dc2626';
        statusSubtitle.textContent = 'Le buzzer est en fonctionnement';
        infoState.textContent = 'ON';
        infoState.style.color = '#dc2626';
        addHistory('Alarme activée', 'danger');
    } else {
        statusIcon.textContent = '🔕';
        statusIcon.classList.remove('active');
        statusTitle.textContent = 'Alarme Désactivée';
        statusTitle.style.color = '#16a34a';
        statusSubtitle.textContent = 'L\'alarme est actuellement éteinte';
        infoState.textContent = 'OFF';
        infoState.style.color = '#16a34a';
        addHistory('Alarme désactivée', 'success');
    }
    
    // Mise à jour de l'heure
    const time = new Date(data.lastUpdate);
    infoLastUpdate.textContent = time.toLocaleTimeString('fr-FR');
}

function updateArduinoConnection(connected) {
    currentState.connected = connected;
    
    const infoArduino = document.getElementById('infoArduino');
    const btnOn = document.getElementById('btnOn');
    const btnOff = document.getElementById('btnOff');
    
    if (connected) {
        infoArduino.textContent = '✅ Connecté';
        infoArduino.style.color = '#16a34a';
        btnOn.disabled = false;
        btnOff.disabled = false;
        addHistory('Arduino connecté', 'success');
    } else {
        infoArduino.textContent = '❌ Déconnecté';
        infoArduino.style.color = '#dc2626';
        btnOn.disabled = true;
        btnOff.disabled = true;
        addHistory('Arduino déconnecté', 'error');
    }
}

function updateConnectionStatus(connected) {
    const indicator = document.getElementById('connectionIndicator');
    const text = document.getElementById('connectionText');
    
    if (connected) {
        indicator.classList.add('connected');
        indicator.classList.remove('disconnected');
        text.textContent = 'Connecté';
        text.style.color = '#16a34a';
    } else {
        indicator.classList.add('disconnected');
        indicator.classList.remove('connected');
        text.textContent = 'Déconnecté';
        text.style.color = '#dc2626';
    }
}

function addHistory(message, type = 'info') {
    const historyList = document.getElementById('historyList');
    const time = new Date().toLocaleTimeString('fr-FR');
    
    const item = document.createElement('div');
    item.className = 'history-item';
    
    let emoji = 'ℹ️';
    if (type === 'success') emoji = '✅';
    if (type === 'danger') emoji = '🚨';
    if (type === 'error') emoji = '❌';
    
    item.innerHTML = `
        <span class="history-time">${time}</span>
        <span class="history-message">${emoji} ${message}</span>
    `;
    
    // Ajouter en haut de la liste
    historyList.insertBefore(item, historyList.firstChild);
    
    // Limiter à 20 entrées
    while (historyList.children.length > 20) {
        historyList.removeChild(historyList.lastChild);
    }
}

// ============= API CALLS =============

async function activateAlarm() {
    try {
        const response = await fetch(`${API_URL}/alarm/on`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        console.log('Réponse API ON:', result);
        
        if (!result.success) {
            addHistory('Erreur: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Erreur lors de l\'activation:', error);
        addHistory('Erreur de communication', 'error');
    }
}

async function deactivateAlarm() {
    try {
        const response = await fetch(`${API_URL}/alarm/off`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        console.log('Réponse API OFF:', result);
        
        if (!result.success) {
            addHistory('Erreur: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Erreur lors de la désactivation:', error);
        addHistory('Erreur de communication', 'error');
    }
}

async function refreshStatus() {
    try {
        const response = await fetch(`${API_URL}/status`);
        const result = await response.json();
        
        if (result.success) {
            updateState(result.data);
        }
    } catch (error) {
        console.error('Erreur lors du refresh:', error);
    }
}

// ============= INITIALISATION =============

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Application démarrée');
    
    // Connexion WebSocket
    connectWebSocket();
    
    // Rafraîchir toutes les 10 secondes (backup si WS échoue)
    setInterval(refreshStatus, 10000);
    
    addHistory('Application démarrée');
});