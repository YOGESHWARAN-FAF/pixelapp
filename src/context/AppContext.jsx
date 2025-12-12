
import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import { createEmptyMatrix } from '../utils/matrixUtils';
import { generateDesignFrame, generateTextFrame, generateComboFrame } from '../utils/frameGenerators';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // --- Persisted Settings ---
    const [matrixWidth, setMatrixWidth] = useState(() => parseInt(localStorage.getItem('matrixWidth')) || 40);
    const [matrixHeight, setMatrixHeight] = useState(() => parseInt(localStorage.getItem('matrixHeight')) || 10);
    const [ip, setIp] = useState(() => localStorage.getItem('ip') || '192.168.4.1');
    const [port, setPort] = useState(() => localStorage.getItem('port') || '81');
    // 'auto' | 'ws' | 'wss' - when 'auto' we pick based on page protocol
    const [wsScheme, setWsScheme] = useState(() => localStorage.getItem('wsScheme') || 'auto');

    // --- Runtime State ---
    const [matrix, setMatrix] = useState(createEmptyMatrix(matrixWidth, matrixHeight));
    const [connectionStatus, setConnectionStatus] = useState('Disconnected'); // Disconnected, Connecting, Connected
    const [logs, setLogs] = useState([]);

    // --- Animation State ---
    const [animationMode, setAnimationMode] = useState(null); // 'design', 'text', 'combo', or null
    const [animationParams, setAnimationParams] = useState({});
    const [isSending, setIsSending] = useState(false);

    const socketRef = useRef(null);
    const animationRef = useRef(null);
    const offsetRef = useRef(0);

    // --- Effects ---
    useEffect(() => {
        localStorage.setItem('matrixWidth', matrixWidth);
        localStorage.setItem('matrixHeight', matrixHeight);
        // When size changes, reset matrix
        setMatrix(createEmptyMatrix(matrixWidth, matrixHeight));
    }, [matrixWidth, matrixHeight]);

    useEffect(() => {
        localStorage.setItem('ip', ip);
        localStorage.setItem('port', port);
        localStorage.setItem('wsScheme', wsScheme);
    }, [ip, port]);

    // --- Helper Functions ---

    const addLog = useCallback((type, message) => {
        const entry = {
            id: Date.now() + Math.random(),
            time: new Date().toLocaleTimeString(),
            type, // 'sent', 'received', 'info', 'error'
            message: typeof message === 'object' ? JSON.stringify(message) : message
        };
        setLogs(prev => [entry, ...prev].slice(0, 100)); // Keep last 100
    }, []);

    const connect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.close();
        }

        setConnectionStatus('Connecting...');

        // Determine scheme: honor explicit choice, otherwise auto-select based on page protocol
        const pageIsSecure = (typeof window !== 'undefined' && window.location && window.location.protocol === 'https:');
        let scheme = 'ws';
        if (wsScheme === 'auto') {
            scheme = pageIsSecure ? 'wss' : 'ws';
        } else {
            scheme = wsScheme;
        }

        addLog('info', `Connecting to ${scheme}://${ip}:${port}/...`);

        try {
            // If the page is secure but user explicitly selected 'ws', warn and avoid connecting
            if (pageIsSecure && scheme === 'ws') {
                const msg = 'Blocked: page is HTTPS but connection scheme is ws:// — mixed-content is disallowed. Choose wss or host backend with TLS.';
                addLog('error', msg);
                setConnectionStatus('Disconnected');
                return;
            }

            const ws = new WebSocket(`${scheme}://${ip}:${port}/`);

            ws.onopen = () => {
                setConnectionStatus('Connected');
                addLog('info', 'WebSocket Connected');
            };

            ws.onclose = () => {
                setConnectionStatus('Disconnected');
                addLog('info', 'WebSocket Disconnected');
            };

            ws.onerror = (err) => {
                console.error("WS Error", err);
                setConnectionStatus('Disconnected');
                // Provide a helpful hint when wss failed from an HTTPS page
                if (scheme === 'wss' && pageIsSecure) {
                    addLog('error', 'WebSocket Error: failed to establish secure (wss) connection. Ensure the server supports TLS/wss or host a proxy with TLS.');
                } else {
                    addLog('error', `WebSocket Error: ${err && err.message ? err.message : 'unknown'}`);
                }
            };

            ws.onmessage = (event) => {
                addLog('received', event.data);
            };

            socketRef.current = ws;
        } catch (e) {
            setConnectionStatus('Disconnected');
            addLog('error', `Connection failed: ${e.message}`);
        }
    }, [ip, port, addLog]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
        setConnectionStatus('Disconnected');
    }, []);

    const sendFrame = useCallback((payload) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(payload));
            addLog('sent', payload);
        }
    }, [addLog]);

    const updateMatrix = (newMatrix) => {
        setMatrix(newMatrix);
    };

    const clearLogs = () => setLogs([]);

    // --- Global Animation Control ---

    const stopAnimation = useCallback(() => {
        if (animationRef.current) {
            clearInterval(animationRef.current);
            animationRef.current = null;
        }
        setAnimationMode(null);
        setIsSending(false);
    }, []);

    const startAnimation = useCallback((mode, params, sendOverWs) => {
        stopAnimation();
        setAnimationMode(mode);
        setAnimationParams(params);
        setIsSending(sendOverWs);
        offsetRef.current = 0;

        const speed = params.speed || 50;
        const intervalMs = 1000 / Math.max(1, speed);

        animationRef.current = setInterval(() => {
            offsetRef.current += 1;
            let frame = null;

            if (mode === 'design') {
                frame = generateDesignFrame(params, offsetRef.current, matrixWidth, matrixHeight);
            } else if (mode === 'text') {
                frame = generateTextFrame(params, offsetRef.current, matrixWidth, matrixHeight);
            } else if (mode === 'combo') {
                frame = generateComboFrame(params, offsetRef.current, matrixWidth, matrixHeight);
            }

            if (frame) {
                updateMatrix(frame);
                if (sendOverWs) {
                    sendFrame({
                        cmd: "matrix",
                        matrixWidth,
                        matrixHeight,
                        direction: params.direction,
                        speed: params.speed,
                        brightness: params.brightness,
                        dataType: mode,
                        ...params, // Spread other params like pattern, text, colors
                        frames: [{ data: frame }]
                    });
                }
            }
        }, intervalMs);
    }, [matrixWidth, matrixHeight, sendFrame, stopAnimation]);

    // Cleanup on unmount
    useEffect(() => {
        return () => stopAnimation();
    }, [stopAnimation]);


    return (
        <AppContext.Provider value={{
            matrixWidth, setMatrixWidth,
            matrixHeight, setMatrixHeight,
            ip, setIp,
            port, setPort,
            matrix, updateMatrix,
            connectionStatus, connect, disconnect,
            logs, addLog, clearLogs,
            sendFrame,
            // Animation exports
            startAnimation, stopAnimation, isSending, animationMode
        }}>
            {children}
        </AppContext.Provider>
    );
};
