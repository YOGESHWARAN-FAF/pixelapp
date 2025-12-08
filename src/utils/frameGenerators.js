import { generatePattern, textToMatrix, hexToNearestColorChar, createEmptyMatrix } from './matrixUtils';

export const generateDesignFrame = (params, offset, matrixWidth, matrixHeight) => {
    const { pattern, colorHex, useAutoColor, direction } = params;
    const colorChar = hexToNearestColorChar(colorHex);

    let matrix = generatePattern(pattern, colorChar, matrixWidth, matrixHeight, useAutoColor);

    if (direction !== 'static') {
        const newMatrix = [...matrix];
        if (direction === 'left') {
            const shift = offset % matrixWidth;
            for (let r = 0; r < matrixHeight; r++) {
                const row = matrix[r];
                newMatrix[r] = row.substring(shift) + row.substring(0, shift);
            }
        } else if (direction === 'right') {
            const shift = offset % matrixWidth;
            for (let r = 0; r < matrixHeight; r++) {
                const row = matrix[r];
                const split = row.length - shift;
                newMatrix[r] = row.substring(split) + row.substring(0, split);
            }
        }
        matrix = newMatrix;
    }
    return matrix;
};

export const generateTextFrame = (params, offset, matrixWidth, matrixHeight) => {
    const { text, colorHex, direction } = params;
    const colorChar = hexToNearestColorChar(colorHex);
    const minWidth = Math.max(matrixWidth, text.length * 6 + matrixWidth);
    // Ensure fullTextWidth is a multiple of matrixWidth for perfect loop sync with patterns
    const fullTextWidth = Math.ceil(minWidth / matrixWidth) * matrixWidth;
    const fullTextMatrix = textToMatrix(text, colorChar, fullTextWidth, matrixHeight);

    const frame = createEmptyMatrix(matrixWidth, matrixHeight);
    for (let r = 0; r < matrixHeight; r++) {
        const fullRow = fullTextMatrix[r];
        let slice = "";
        if (direction === 'left') {
            const start = offset % fullRow.length;
            slice = fullRow.substring(start, start + matrixWidth);
            if (slice.length < matrixWidth) slice += fullRow.substring(0, matrixWidth - slice.length);
        } else if (direction === 'right') {
            // Simplified right scroll or static
            const start = (fullRow.length - (offset % fullRow.length)) % fullRow.length;
            // This logic needs to be robust for right scroll, but for now let's stick to simple static if not left
            // Or implement proper right scroll:
            slice = fullRow.substring(0, matrixWidth); // Placeholder for right
        } else {
            slice = fullRow.substring(0, matrixWidth);
        }
        frame[r] = slice;
    }
    return frame;
};

export const generateComboFrame = (params, offset, matrixWidth, matrixHeight) => {
    const { pattern, text, patternColor, textColor, useAutoColor, mode, direction } = params;
    const pColor = hexToNearestColorChar(patternColor);
    const tColor = hexToNearestColorChar(textColor);

    // 1. Generate Pattern
    let patternMatrix = generatePattern(pattern, pColor, matrixWidth, matrixHeight, useAutoColor);

    // Apply shift to pattern if moving
    if (direction === 'left') {
        const shift = offset % matrixWidth;
        patternMatrix = patternMatrix.map(row => {
            return row.substring(shift) + row.substring(0, shift);
        });
    }

    // 2. Generate Text
    const minWidth = Math.max(matrixWidth, text.length * 6 + matrixWidth);
    // Ensure fullTextWidth is a multiple of matrixWidth for perfect loop sync with patterns
    const fullTextWidth = Math.ceil(minWidth / matrixWidth) * matrixWidth;
    const fullTextMatrix = textToMatrix(text, tColor, fullTextWidth, matrixHeight);

    const textFrame = createEmptyMatrix(matrixWidth, matrixHeight);
    for (let r = 0; r < matrixHeight; r++) {
        const fullRow = fullTextMatrix[r];
        let slice = "";
        if (direction === 'left') {
            const start = offset % fullRow.length;
            slice = fullRow.substring(start, start + matrixWidth);
            if (slice.length < matrixWidth) slice += fullRow.substring(0, matrixWidth - slice.length);
        } else {
            slice = fullRow.substring(0, matrixWidth);
        }
        textFrame[r] = slice;
    }

    // 3. Generate Mask (Buffer around text)
    // 3 pixels horizontal, 1 pixel vertical
    const mask = Array(matrixHeight).fill().map(() => Array(matrixWidth).fill(false));

    for (let r = 0; r < matrixHeight; r++) {
        const rowStr = textFrame[r];
        for (let c = 0; c < matrixWidth; c++) {
            if (rowStr[c] !== '0') {
                // Mark neighbors
                for (let dr = -3; dr <= 3; dr++) {
                    for (let dc = -3; dc <= 3; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < matrixHeight && nc >= 0 && nc < matrixWidth) {
                            mask[nr][nc] = true;
                        }
                    }
                }
            }
        }
    }

    // 4. Combine
    const finalFrame = createEmptyMatrix(matrixWidth, matrixHeight);

    for (let r = 0; r < matrixHeight; r++) {
        const pRow = patternMatrix[r].split('');
        const tRow = textFrame[r].split('');
        const fRow = new Array(matrixWidth).fill('0');

        for (let c = 0; c < matrixWidth; c++) {
            const pVal = pRow[c];
            const tVal = tRow[c];

            if (mode === 'overlay') {
                if (tVal !== '0') {
                    fRow[c] = tVal; // Text
                } else if (mask[r][c]) {
                    fRow[c] = '0'; // Buffer/Mask (Black)
                } else {
                    fRow[c] = pVal; // Pattern
                }
            } else if (mode === 'bottom-scroll') {
                if (r >= matrixHeight - 7) {
                    fRow[c] = tVal !== '0' ? tVal : '0';
                } else {
                    fRow[c] = pVal;
                }
            } else if (mode === 'middle-scroll') {
                const startY = Math.floor((matrixHeight - 7) / 2);
                if (r >= startY && r < startY + 7) {
                    fRow[c] = tVal !== '0' ? tVal : pVal;
                } else {
                    fRow[c] = pVal;
                }
            }
        }
        finalFrame[r] = fRow.join('');
    }

    return finalFrame;
};
