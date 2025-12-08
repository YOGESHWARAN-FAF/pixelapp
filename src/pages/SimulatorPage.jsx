
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import MatrixGrid from '../components/MatrixGrid';
import { createEmptyMatrix } from '../utils/matrixUtils';
import { Trash2, RefreshCw, Send } from 'lucide-react';

const SimulatorPage = () => {
    const {
        matrixWidth, matrixHeight, updateMatrix, sendFrame, matrix
    } = useContext(AppContext);

    const [liveSend, setLiveSend] = useState(false);

    const handleClear = () => {
        const empty = createEmptyMatrix(matrixWidth, matrixHeight);
        updateMatrix(empty);
        if (liveSend) {
            sendFrame({
                cmd: "matrix",
                matrixWidth,
                matrixHeight,
                direction: "static",
                speed: 0,
                brightness: 100,
                frames: [{ data: empty }]
            });
        }
    };

    const handlePreview = () => {
        // Just re-renders, but effectively confirms current state
        // In a real app, maybe this fetches state from a backend or something
        // But here, local state is truth.
        if (liveSend) {
            sendFrame({
                cmd: "matrix",
                matrixWidth,
                matrixHeight,
                direction: "static",
                speed: 0,
                brightness: 100,
                frames: [{ data: matrix }]
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Simulator</h2>
                <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={liveSend}
                            onChange={(e) => setLiveSend(e.target.checked)}
                            className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Send Live</span>
                    </label>
                </div>
            </div>

            <MatrixGrid />

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={handlePreview}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                    <RefreshCw size={20} />
                    <span>Refresh / Send</span>
                </button>

                <button
                    onClick={handleClear}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                    <Trash2 size={20} />
                    <span>Clear Matrix</span>
                </button>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-sm text-gray-400">
                <p>
                    <strong>Note:</strong> The simulator reflects the internal app state.
                    When you use Text or Design pages, they update this state.
                </p>
            </div>
        </div>
    );
};

export default SimulatorPage;
