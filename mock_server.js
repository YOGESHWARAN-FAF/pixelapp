import { WebSocketServer } from 'ws';
import os from "os";

const PORT = 8080;

// Get local network IP
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (let iface of Object.values(interfaces)) {
        for (let cfg of iface) {
            if (cfg.family === "IPv4" && !cfg.internal) {
                return cfg.address;
            }
        }
    }
    return "127.0.0.1";
}

const localIP = getLocalIP();

// Bind to 0.0.0.0 so LAN devices can access
const wss = new WebSocketServer({ host: "0.0.0.0", port: PORT });

console.log(`Mock ESP32 WebSocket Server running`);
console.log(`👉 ws://${localIP}:${PORT}`);

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.send(JSON.stringify({ 
        type: "info", 
        message: "Connected to Mock ESP32" 
    }));

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            console.log("Received:", data);
        } catch (e) {
            console.log("Raw:", message.toString());
        }
    });

    ws.on("close", () => console.log("Client disconnected"));
});
