const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const os = require('os');

const options = {
  key: fs.readFileSync('./localhost-key.pem'), // Clé privée
  cert: fs.readFileSync('./localhost.pem')    // Chaîne de certificats (optionnel)
};

const server = https.createServer(options);

server.listen(8080, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log('Serveur WSS démarré sur:');
  console.log(`- Local: wss://localhost:8080`);
  console.log(`- Réseau: wss://${localIP}:8080`);
  console.log(`- Toutes interfaces: wss://0.0.0.0:8080`);
});

// Fonction pour obtenir l'adresse IP locale
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return 'localhost';
}

// Créer le serveur WebSocket sur le port 8080
// Écouter sur toutes les interfaces (0.0.0.0) au lieu de localhost seulement
const wss = new WebSocket.Server({ 
  server, // Utiliser le serveur HTTPS
  verifyClient: (info, callback) => {
    // Autoriser toutes les origines en développement
    callback(true);
  }
});

const localIP = getLocalIP();
console.log('Serveur WebSocket démarré sur:');
console.log(`- Local: ws://localhost:8080`);
console.log(`- Réseau: ws://${localIP}:8080`);
console.log(`- Toutes interfaces: ws://0.0.0.0:8080`);

// Stocker toutes les connexions actives
const clients = new Set();

wss.on('connection', function connection(ws, req) {
    const clientIP = req.socket.remoteAddress;
    console.log(`Nouvelle connexion depuis ${clientIP}`);

    // Ajouter le client à la liste
    clients.add(ws);

    // Message de bienvenue avec informations de connexion
    ws.send(JSON.stringify({
        type: 'system',
        message: 'Bienvenue ! Vous êtes connecté au serveur.',
        serverInfo: {
            localIP: localIP,
            port: 8080,
            timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
    }));

    // Notifier les autres clients
    broadcast(JSON.stringify({
        type: 'notification',
        message: `Un nouvel utilisateur s'est connecté (${clientIP})`,
        timestamp: new Date().toISOString()
    }), ws);

    // Écouter les messages
    ws.on('message', function incoming(data) {
        try {
            const message = JSON.parse(data);
            console.log('Message reçu:', message);

            // Créer la réponse
            const response = {
                type: 'message',
                message: `Echo: ${message.content}`,
                originalMessage: message.content,
                timestamp: new Date().toISOString(),
                from: clientIP
            };

            // Renvoyer à tous les clients connectés
            broadcast(JSON.stringify(response));

        } catch (error) {
            // Si ce n'est pas du JSON, traiter comme texte simple
            console.log('Message texte reçu:', data.toString());

            const response = {
                type: 'message',
                message: `Echo: ${data.toString()}`,
                timestamp: new Date().toISOString(),
                from: clientIP
            };

            broadcast(JSON.stringify(response));
        }
    });

    // Gérer la déconnexion
    ws.on('close', function () {
        console.log(`Client déconnecté: ${clientIP}`);
        clients.delete(ws);

        // Notifier les autres clients
        broadcast(JSON.stringify({
            type: 'notification',
            message: `Un utilisateur s'est déconnecté (${clientIP})`,
            timestamp: new Date().toISOString()
        }));
    });

    // Gérer les erreurs
    ws.on('error', function (error) {
        console.error('Erreur WebSocket:', error);
        clients.delete(ws);
    });
});

// Fonction pour diffuser un message à tous les clients
function broadcast(message, exclude = null) {
    clients.forEach(client => {
        if (client !== exclude && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Gérer l'arrêt propre du serveur
process.on('SIGINT', () => {
    console.log('\nArrêt du serveur...');
    wss.close(() => {
        console.log('Serveur fermé.');
        process.exit(0);
    });
});

// Endpoint de santé simple (optionnel)
const http = require('http');
const healthServer = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            websocket: `ws://${localIP}:8080`,
            timestamp: new Date().toISOString()
        }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

healthServer.listen(8081, () => {
    console.log(`Serveur de santé HTTP sur http://${localIP}:8081/health`);
});