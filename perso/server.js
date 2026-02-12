const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const net = require('net');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Configuration
const ARDUINO_IP = '172.29.19.187';
const ARDUINO_PORT = 8888;
const SERVER_IP = '172.29.18.254';
const SERVER_PORT = 3000;

// État de l'alarme
let alarmState = {
    status: 'OFF',
    lastUpdate: new Date(),
    connected: false
};

// Clients WebSocket connectés
let wsClients = [];

// Middleware
app.use(express.json());
app.use(express.static('public'));

// ============= COMMUNICATION ARDUINO (TCP) =============

let arduinoClient = null;
let reconnectInterval = null;

function connectToArduino() {
    console.log(`[TCP] Tentative de connexion à Arduino ${ARDUINO_IP}:${ARDUINO_PORT}...`);
    
    arduinoClient = new net.Socket();
    
    arduinoClient.connect(ARDUINO_PORT, ARDUINO_IP, () => {
        console.log('[TCP] ✅ Connecté à Arduino');
        alarmState.connected = true;
        broadcastToClients({ type: 'connection', connected: true });
        
        // Demander l'état initial
        sendToArduino('STATUS');
    });
    
    arduinoClient.on('data', (data) => {
        const message = data.toString().trim();
        console.log(`[TCP] ← Arduino: ${message}`);
        
        // Parser la réponse
        if (message.includes('ALARM_ON')) {
            alarmState.status = 'ON';
        } else if (message.includes('ALARM_OFF')) {
            alarmState.status = 'OFF';
        } else if (message.includes('STATUS')) {
            alarmState.status = message.split(':')[1] || 'OFF';
        }
        
        alarmState.lastUpdate = new Date();
        
        // Broadcast aux clients WebSocket
        broadcastToClients({
            type: 'state',
            data: alarmState
        });
    });
    
    arduinoClient.on('error', (err) => {
        console.error('[TCP] ❌ Erreur:', err.message);
        alarmState.connected = false;
        broadcastToClients({ type: 'connection', connected: false });
    });
    
    arduinoClient.on('close', () => {
        console.log('[TCP] 🔌 Connexion fermée');
        alarmState.connected = false;
        broadcastToClients({ type: 'connection', connected: false });
        
        // Reconnexion automatique
        if (!reconnectInterval) {
            reconnectInterval = setInterval(() => {
                connectToArduino();
            }, 5000);
        }
    });
}

function sendToArduino(command) {
    if (arduinoClient && alarmState.connected) {
        console.log(`[TCP] → Arduino: ${command}`);
        arduinoClient.write(command + '\n');
        return true;
    } else {
        console.error('[TCP] ⚠️ Arduino non connecté');
        return false;
    }
}

// ============= WEBSOCKET (Temps réel vers Front) =============

wss.on('connection', (ws) => {
    console.log('[WS] Nouveau client connecté');
    wsClients.push(ws);
    
    // Envoyer l'état actuel
    ws.send(JSON.stringify({
        type: 'state',
        data: alarmState
    }));
    
    ws.on('close', () => {
        console.log('[WS] Client déconnecté');
        wsClients = wsClients.filter(client => client !== ws);
    });
    
    ws.on('error', (err) => {
        console.error('[WS] Erreur:', err.message);
    });
});

function broadcastToClients(message) {
    const data = JSON.stringify(message);
    wsClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// ============= API REST =============

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API - Obtenir l'état
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        data: alarmState
    });
});

// API - Activer l'alarme
app.post('/api/alarm/on', (req, res) => {
    const sent = sendToArduino('ALARM_ON');
    res.json({
        success: sent,
        message: sent ? 'Commande envoyée' : 'Arduino non connecté',
        data: alarmState
    });
});

// API - Désactiver l'alarme
app.post('/api/alarm/off', (req, res) => {
    const sent = sendToArduino('ALARM_OFF');
    res.json({
        success: sent,
        message: sent ? 'Commande envoyée' : 'Arduino non connecté',
        data: alarmState
    });
});

// API - Demander le status
app.get('/api/refresh', (req, res) => {
    const sent = sendToArduino('STATUS');
    res.json({
        success: sent,
        message: sent ? 'Demande de status envoyée' : 'Arduino non connecté',
        data: alarmState
    });
});

// ============= DÉMARRAGE =============

// Connexion à l'Arduino
connectToArduino();

// Démarrage du serveur sur l'IP spécifique
server.listen(SERVER_PORT, SERVER_IP, () => {
    console.log('='.repeat(50));
    console.log('🚀 Serveur Node.js démarré');
    console.log('='.repeat(50));
    console.log(`📍 Adresse: http://${SERVER_IP}:${SERVER_PORT}`);
    console.log(`🔌 Arduino: ${ARDUINO_IP}:${ARDUINO_PORT}`);
    console.log('='.repeat(50));
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
    console.log('\n[SERVER] Arrêt du serveur...');
    if (arduinoClient) {
        arduinoClient.destroy();
    }
    server.close(() => {
        console.log('[SERVER] Serveur arrêté');
        process.exit(0);
    });
});