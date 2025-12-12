import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Play, Square, Eye } from 'lucide-react';
import MatrixCanvas from '../components/MatrixCanvas';

const PATTERNS = [
    'plasma', 'fire-real', 'matrix-rain',
    'leaf', 'flower', 'heart', 'smile', 'sad',
    'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
    'wave', 'rain', 'fire', 'sparkle', 'star',
    'diamond', 'square', 'circle', 'checker', 'zigzag',
    'diagonal-stripes', 'border', 'cross', 'plus', 'minus',
    'equal', 'wifi', 'music', 'bell', 'sun', 'moon',
    'stripes-horz', 'stripes-vert', 'fill', 'rainbow'
];

const DesignPage = () => {
    const {
        startAnimation, stopAnimation, isSending, animationMode, customPatterns
    } = useContext(AppContext);

    const [pattern, setPattern] = useState('heart');
    const [colorHex, setColorHex] = useState('#FF0000'); // Red
    const [useAutoColor, setUseAutoColor] = useState(false);
    const [direction, setDirection] = useState('static');
    const [speed, setSpeed] = useState(50);
    const [brightness, setBrightness] = useState(200);

    const allPatterns = [
        ...Object.keys(customPatterns || {}),
        ...PATTERNS
    ];

    const handlePreview = () => {
        startAnimation('design', {
            pattern, colorHex, useAutoColor, direction, speed, brightness
        }, false);
    };

    const handleStartSend = () => {
        startAnimation('design', {
            pattern, colorHex, useAutoColor, direction, speed, brightness
        }, true);
    };

    // Check if this page's mode is active
    const isMyMode = animationMode === 'design';
    const isSendingMyMode = isSending && isMyMode;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Design Patterns</h2>

            <MatrixCanvas />

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Pattern</label>
                    <select
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none"
                    >
                        {Object.keys(customPatterns || {}).length > 0 && (
                            <optgroup label="Custom Patterns">
                                {Object.keys(customPatterns).map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </optgroup>
                        )}
                        <optgroup label="Standard Patterns">
                            {PATTERNS.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </optgroup>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Color Settings</label>
                    <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700">
                        <div className={`flex items-center space-x-2 ${useAutoColor ? 'opacity-50 pointer-events-none' : ''}`}>
                            <input
                                type="color"
                                value={colorHex}
                                onChange={(e) => setColorHex(e.target.value)}
                                className="h-10 w-10 rounded cursor-pointer bg-transparent border-none"
                            />
                            <span className="text-gray-400">{colorHex}</span>
                        </div>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useAutoColor}
                                onChange={(e) => setUseAutoColor(e.target.checked)}
                                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-white text-sm">Auto Color</span>
                        </label>
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
                            <option value="static">Static</option>
                            <option value="left">Left</option>
                            <option value="right">Right</option>
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

export default DesignPage;
