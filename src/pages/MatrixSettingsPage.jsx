
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Save } from 'lucide-react';

const MatrixSettingsPage = () => {
    const { matrixWidth, setMatrixWidth, matrixHeight, setMatrixHeight } = useContext(AppContext);

    // Local state for inputs to avoid resizing on every keystroke
    const [width, setWidth] = useState(matrixWidth);
    const [height, setHeight] = useState(matrixHeight);

    useEffect(() => {
        setWidth(matrixWidth);
        setHeight(matrixHeight);
    }, [matrixWidth, matrixHeight]);

    const handleApply = () => {
        const w = parseInt(width);
        const h = parseInt(height);
        if (w > 0 && h > 0) {
            setMatrixWidth(w);
            setMatrixHeight(h);
            alert(`Matrix size updated to ${w} x ${h}`);
        } else {
            alert('Please enter valid dimensions');
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Matrix Configuration</h2>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Matrix Width (Columns)</label>
                    <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Matrix Height (Rows)</label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                    <p className="text-sm text-gray-400">Total LEDs: <span className="text-white font-bold">{width * height}</span></p>
                </div>

                <button
                    onClick={handleApply}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                    <Save size={20} />
                    <span>Apply Matrix Size</span>
                </button>
            </div>

            <div className="text-sm text-gray-500 text-center">
                Changing size will reset the current display.
            </div>
        </div>
    );
};

export default MatrixSettingsPage;
