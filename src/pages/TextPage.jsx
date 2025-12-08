import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Play, Square, Eye } from 'lucide-react';
import MatrixGrid from '../components/MatrixGrid';

const TextPage = () => {
    const {
        startAnimation, stopAnimation, isSending, animationMode
    } = useContext(AppContext);

    const [text, setText] = useState('YOGI');
    const [colorHex, setColorHex] = useState('#FFFF00'); // Default Yellow
    const [direction, setDirection] = useState('left');
    const [speed, setSpeed] = useState(40);
    const [brightness, setBrightness] = useState(200);

    const handlePreview = () => {
        startAnimation('text', {
            text, colorHex, direction, speed, brightness
        }, false);
    };

    const handleStartSend = () => {
        startAnimation('text', {
            text, colorHex, direction, speed, brightness
        }, true);
    };

    // Check if this page's mode is active
    const isMyMode = animationMode === 'text';
    const isSendingMyMode = isSending && isMyMode;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Text Mode</h2>

            <MatrixGrid />

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="color"
                            value={colorHex}
                            onChange={(e) => setColorHex(e.target.value)}
                            className="h-10 w-10 rounded cursor-pointer bg-transparent border-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Direction</label>
                        <select
                            value={direction}
                            onChange={(e) => setDirection(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none"
                        >
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                            <option value="static">Static</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Speed ({speed})</label>
                        <input
                            type="range"
                            min="1" max="100"
                            value={speed}
                            onChange={(e) => setSpeed(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Brightness ({brightness})</label>
                    <input
                        type="range"
                        min="5" max="255"
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <button
                        onClick={handlePreview}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2"
                    >
                        <Eye size={20} />
                        <span>Preview</span>
                    </button>
                    <button
                        onClick={handleStartSend}
                        disabled={isSending}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2"
                    >
                        <Play size={20} />
                        <span>Start Send</span>
                    </button>
                    <button
                        onClick={stopAnimation}
                        disabled={!isSending}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2"
                    >
                        <Square size={20} />
                        <span>Stop Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TextPage;
