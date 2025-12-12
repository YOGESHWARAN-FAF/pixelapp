
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
    'stripes-horz', 'stripes-vert', 'fill'
];

const ComboPage = () => {
    const {
        startAnimation, stopAnimation, isSending, animationMode
    } = useContext(AppContext);

    const [pattern, setPattern] = useState('heart');
    const [text, setText] = useState('YOGI');
    const [patternColor, setPatternColor] = useState('#FF0000');
    const [textColor, setTextColor] = useState('#FFFF00');
    const [useAutoColor, setUseAutoColor] = useState(false);
    const [mode, setMode] = useState('overlay'); // overlay, bottom-scroll, middle-scroll
    const [direction, setDirection] = useState('left');
    const [speed, setSpeed] = useState(40);
    const [brightness, setBrightness] = useState(200);

    const handlePreview = () => {
        startAnimation('combo', {
            pattern, text, patternColor, textColor, useAutoColor, mode, direction, speed, brightness
        }, false);
    };

    const handleStartSend = () => {
        startAnimation('combo', {
            pattern, text, patternColor, textColor, useAutoColor, mode, direction, speed, brightness
        }, true);
    };

    // Check if this page's mode is active
    const isMyMode = animationMode === 'combo';
    const isSendingMyMode = isSending && isMyMode;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Combo Mode</h2>

            <MatrixCanvas />

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Pattern</label>
                        <select
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none"
                        >
                            {PATTERNS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Mode</label>
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none"
                        >
                            <option value="overlay">Overlay (Text over Pattern)</option>
                            <option value="bottom-scroll">Bottom Scroll</option>
                            <option value="middle-scroll">Middle Scroll</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Text Color</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                className="h-10 w-full rounded cursor-pointer bg-transparent border-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Pattern Color</label>
                        <div className="flex items-center justify-between bg-gray-900 p-2 rounded-lg border border-gray-700">
                            <div className={`flex items-center space-x-2 ${useAutoColor ? 'opacity-50 pointer-events-none' : ''}`}>
                                <input
                                    type="color"
                                    value={patternColor}
                                    onChange={(e) => setPatternColor(e.target.value)}
                                    className="h-8 w-8 rounded cursor-pointer bg-transparent border-none"
                                />
                            </div>
                            <label className="flex items-center space-x-2 cursor-pointer ml-2">
                                <input
                                    type="checkbox"
                                    checked={useAutoColor}
                                    onChange={(e) => setUseAutoColor(e.target.checked)}
                                    className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-white text-xs">Auto</span>
                            </label>
                        </div>
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

export default ComboPage;
