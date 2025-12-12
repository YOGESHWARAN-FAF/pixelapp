import React, { useRef, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { COLORS } from '../utils/matrixUtils';

const MatrixCanvas = () => {
    const { matrix, matrixWidth, matrixHeight } = useContext(AppContext);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');

        // Calculate pixel size based on container width
        // We want the canvas to fill the container width, but maintain aspect ratio
        // The container handles the scrolling if it's too wide, but here we want to fit if possible
        // or grow if needed.

        // Let's make it responsive:
        // Max width is container width.
        // If matrix is huge, we might need a minimum pixel size.

        const updateCanvasSize = () => {
            const containerWidth = container.clientWidth;
            // Desired minimum pixel size to be legible
            const minPixelSize = 10;

            // Calculate pixel size to fit width
            let pixelSize = Math.floor((containerWidth - 40) / matrixWidth); // 40px padding

            // Enforce minimum size
            if (pixelSize < minPixelSize) pixelSize = minPixelSize;

            // Set canvas dimensions
            canvas.width = matrixWidth * pixelSize;
            canvas.height = matrixHeight * pixelSize;

            // Draw
            draw(ctx, pixelSize);
        };

        const draw = (ctx, pixelSize) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (!matrix || matrix.length === 0) return;

            for (let r = 0; r < matrixHeight; r++) {
                const row = matrix[r];
                if (!row) continue;

                for (let c = 0; c < matrixWidth; c++) {
                    const char = row[c] || '0';
                    const color = COLORS[char] || '#000000';

                    const x = c * pixelSize;
                    const y = r * pixelSize;

                    // Draw pixel
                    ctx.fillStyle = char === '0' ? '#1a1a1a' : color;

                    // Draw rounded rect or circle? Rect is faster and cleaner for pixel art
                    // Let's do a slightly rounded rect for "led" look
                    const gap = 1;
                    const size = pixelSize - gap;

                    if (char !== '0') {
                        // Glow effect
                        ctx.shadowColor = color;
                        ctx.shadowBlur = pixelSize / 2;
                    } else {
                        ctx.shadowBlur = 0;
                    }

                    ctx.beginPath();
                    // Simple rect for performance
                    ctx.fillRect(x + gap / 2, y + gap / 2, size, size);

                    // Reset shadow
                    ctx.shadowBlur = 0;
                }
            }
        };

        // Initial draw
        updateCanvasSize();

        // Handle resize
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);

    }, [matrix, matrixWidth, matrixHeight]);

    return (
        <div ref={containerRef} className="w-full overflow-x-auto p-4 bg-gray-950 rounded-xl shadow-2xl border border-gray-800 flex justify-center items-center min-h-[200px]">
            <canvas ref={canvasRef} className="rounded-lg shadow-inner border border-gray-900" />
        </div>
    );
};

export default MatrixCanvas;
