
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Wifi, WifiOff, Activity } from 'lucide-react';

const ConnectionPage = () => {
    const {
        ip, setIp, port, setPort,
        connect, disconnect, connectionStatus, sendFrame
    } = useContext(AppContext);

    const handlePing = () => {
        sendFrame({
            cmd: "ping",
            message: "hello-from-web-app"
        });
    };

    return (
        <div className="max-w-md mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Connection Settings</h2>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">ESP32 IP Address</label>
                    <input
                        type="text"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="192.168.4.1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">WebSocket Port</label>
                    <input
                        type="number"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="81"
                    />
                </div>

                <div className="pt-4 flex space-x-3">
                    {connectionStatus !== 'Connected' ? (
                        <button
                            onClick={connect}
                            disabled={connectionStatus === 'Connecting...'}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                        >
                            <Wifi size={20} />
                            <span>{connectionStatus === 'Connecting...' ? 'Connecting...' : 'Connect'}</span>
                        </button>
                    ) : (
                        <button
                            onClick={disconnect}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                        >
                            <WifiOff size={20} />
                            <span>Disconnect</span>
                        </button>
                    )}
                </div>
            </div>

            {connectionStatus === 'Connected' && (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Diagnostics</h3>
                    <button
                        onClick={handlePing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                    >
                        <Activity size={20} />
                        <span>Test Ping</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">Check Logs page for response</p>
                </div>
            )}
        </div>
    );
};

export default ConnectionPage;
