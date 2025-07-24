// relay.js
const WebSocket = require('ws');

const PORT = process.env.PORT || 10000; // Render automatically sets PORT env
const server = new WebSocket.Server({ port: PORT });

let host = null;
let client = null;

console.log(`Relay server running on port ${PORT}`);

server.on('connection', (socket, req) => {
    const path = req.url;

    if (path === '/host') {
        host = socket;
        console.log("Host connected");

        host.on('message', (msg) => {
            if (client) client.send(msg);
        });

        host.on('close', () => {
            console.log("Host disconnected");
            host = null;
        });
    }

    else if (path === '/client') {
        client = socket;
        console.log("Client connected");

        client.on('message', (msg) => {
            if (host) host.send(msg);
        });

        client.on('close', () => {
            console.log("Client disconnected");
            client = null;
        });
    }

    else {
        console.log("Unknown connection path:", path);
        socket.close();
    }
});
