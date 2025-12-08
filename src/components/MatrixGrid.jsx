
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { COLORS } from '../utils/matrixUtils';

const MatrixGrid = () => {
    const { matrix, matrixWidth, matrixHeight } = useContext(AppContext);

    return (
        <div className="w-full overflow-x-auto p-6 bg-gray-950 rounded-xl shadow-2xl border border-gray-800 flex justify-center">
            <div
                className="bg-black p-2 rounded-lg border border-gray-800 shadow-inner inline-block"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${matrixWidth}, minmax(8px, 1fr))`,
                    gap: '2px',
                }}
            >
                {matrix.map((row, rIndex) => (
                    row.split('').map((char, cIndex) => {
                        const color = COLORS[char] || '#000';
                        const isOff = char === '0';
                        return (
                            <div
                                key={`${rIndex}-${cIndex}`}
                                className={`w-3 h-3 rounded-full transition-all duration-75 ${!isOff ? 'shadow-[0_0_4px_rgba(0,0,0,0.8)]' : ''}`}
                                style={{
                                    backgroundColor: isOff ? '#1a1a1a' : color,
                                    boxShadow: isOff ? 'none' : `0 0 4px ${color}, 0 0 8px ${color}`,
                                    opacity: isOff ? 0.5 : 1
                                }}
                                title={`Pos: ${cIndex},${rIndex} Color: ${char}`}
                            />
                        );
                    })
                ))}
            </div>
        </div>
    );
};

export default MatrixGrid;
