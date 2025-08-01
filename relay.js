const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

let host = null;
const clients = new Set();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    if (message === 'role:host') {
      host = ws;
      console.log('Host connected');
    } else if (message === 'role:client') {
      clients.add(ws);
      console.log('Client connected');
    } else if (ws === host) {
      // Broadcast host game state to all clients
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      }
    }
  });

  ws.on('close', () => {
    if (ws === host) host = null;
    clients.delete(ws);
  });
});
