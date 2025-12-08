
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const HomePage = ({ onNavigate }) => {
    const { connectionStatus, matrixWidth, matrixHeight } = useContext(AppContext);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Pixel Matrix</h2>
                <p className="text-blue-100">Control your ESP32 LED matrix with ease.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-200">System Status</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Connection:</span>
                            <span className={connectionStatus === 'Connected' ? 'text-green-400' : 'text-gray-400'}>
                                {connectionStatus}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Matrix Size:</span>
                            <span className="text-white">{matrixWidth} x {matrixHeight}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total LEDs:</span>
                            <span className="text-white">{matrixWidth * matrixHeight}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-200">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onNavigate('connection')}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                        >
                            Connect
                        </button>
                        <button
                            onClick={() => onNavigate('simulator')}
                            className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                        >
                            Simulator
                        </button>
                        <button
                            onClick={() => onNavigate('text')}
                            className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                        >
                            Text Mode
                        </button>
                        <button
                            onClick={() => onNavigate('design')}
                            className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                        >
                            Patterns
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
