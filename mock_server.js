import { WebSocketServer } from 'ws';

const PORT = 8080;

const wss = new WebSocketServer({ port: PORT });

console.log(`Mock ESP32 Server running on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.send(JSON.stringify({ type: 'info', message: 'Connected to Mock ESP32' }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received:', JSON.stringify(data, null, 2));

            // Echo back or acknowledge if needed
            // ws.send(JSON.stringify({ type: 'ack', cmd: data.cmd }));
        } catch (e) {
            console.log('Received raw:', message.toString());
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
