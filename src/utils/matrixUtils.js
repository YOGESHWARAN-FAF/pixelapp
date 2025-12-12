
// Color mapping
export const COLORS = {
  '0': '#000000', // OFF
  'R': '#FF0000', // Red
  'G': '#00FF00', // Green
  'B': '#0000FF', // Blue
  'Y': '#FFFF00', // Yellow
  'C': '#00FFFF', // Cyan
  'M': '#FF00FF', // Magenta
  'W': '#FFFFFF', // White
  'O': '#FFA500', // Orange
  'P': '#FF69B4', // Pink
  'L': '#90EE90', // Light Green
};

export const COLOR_CODES = Object.keys(COLORS).filter(c => c !== '0');

// Simple 5x7 Font (A-Z, 0-9, space)
const FONT = {
  ' ': ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
  'A': ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  'B': ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  'C': ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  'D': ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  'E': ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  'F': ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  'G': ["01110", "10001", "10000", "10011", "10001", "10001", "01110"],
  'H': ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  'I': ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
  'J': ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  'K': ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  'L': ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  'M': ["10001", "11011", "10101", "10001", "10001", "10001", "10001"],
  'N': ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  'O': ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  'P': ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  'Q': ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  'R': ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  'S': ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  'T': ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  'U': ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  'V': ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  'W': ["10001", "10001", "10001", "10001", "10101", "11011", "10001"],
  'X': ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  'Y': ["10001", "10001", "10001", "01010", "00100", "00100", "00100"],
  'Z': ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  '0': ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  '1': ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  '2': ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  '3': ["01110", "10001", "00001", "00110", "00001", "10001", "01110"],
  '4': ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  '5': ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  '6': ["01110", "10001", "10000", "11110", "10001", "10001", "01110"],
  '7': ["11111", "00001", "00010", "00100", "00100", "00100", "00100"],
  '8': ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  '9': ["01110", "10001", "10001", "01111", "00001", "10001", "01110"],
  '.': ["00000", "00000", "00000", "00000", "00000", "00000", "00100"],
  '!': ["00100", "00100", "00100", "00100", "00100", "00000", "00100"],
};

/**
 * Helper class to manipulate matrix data more easily
 */
export class MatrixBuffer {
  constructor(width, height, initialData = null) {
    this.width = width;
    this.height = height;
    if (initialData) {
      this.buffer = initialData.map(row => row.split(''));
    } else {
      this.clear();
    }
  }

  clear(color = '0') {
    this.buffer = Array.from({ length: this.height }, () => Array(this.width).fill(color));
  }

  setPixel(x, y, color) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.buffer[y][x] = color;
    }
  }

  // Draw a filled rectangle
  fillRect(x, y, w, h, color) {
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        this.setPixel(x + i, y + j, color);
      }
    }
  }

  getPixel(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.buffer[y][x];
    }
    return '0';
  }

  // Draw text onto the buffer at specific coordinates with optional scaling
  drawText(text, x, y, color, scale = 1) {
    const upperText = text.toUpperCase();
    let currentX = x;

    for (let char of upperText) {
      const charData = FONT[char] || FONT[' '];
      for (let r = 0; r < 7; r++) {
        const rowStr = charData[r];
        for (let c = 0; c < 5; c++) {
          if (rowStr[c] === '1') {
            if (scale === 1) {
              this.setPixel(currentX + c, y + r, color);
            } else {
              this.fillRect(currentX + c * scale, y + r * scale, scale, scale, color);
            }
          }
        }
      }
      currentX += 6 * scale; // 5px char + 1px space
    }
  }

  // Export as array of strings for the app state / WebSocket
  toMatrix() {
    return this.buffer.map(row => row.join(''));
  }
}

export const createEmptyMatrix = (width, height) => {
  return Array.from({ length: height }, () => '0'.repeat(width));
};

export const hexToNearestColorChar = (hex) => {
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  const target = hexToRgb(hex);
  if (!target) return 'W';

  let minDist = Infinity;
  let bestChar = 'W';

  Object.entries(COLORS).forEach(([char, colorHex]) => {
    if (char === '0') return;
    const c = hexToRgb(colorHex);
    const dist = Math.sqrt(
      Math.pow(c.r - target.r, 2) +
      Math.pow(c.g - target.g, 2) +
      Math.pow(c.b - target.b, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      bestChar = char;
    }
  });

  return bestChar;
};

// Legacy support wrapper using new class
export const textToMatrix = (text, colorChar, width, height) => {
  const mb = new MatrixBuffer(width, height);

  // Calculate scale based on height
  // Base height is 7 (font height). 
  // If height is 10, scale 1. If height is 20, scale 2.
  // Let's be conservative: scale = floor(height / 8) (leaving 1px padding)
  let scale = Math.max(1, Math.floor(height / 8));

  const textHeight = 7 * scale;
  const startY = Math.floor((height - textHeight) / 2);

  mb.drawText(text, 0, startY, colorChar, scale);
  return mb.toMatrix();
};

export const generatePattern = (patternName, colorChar, width, height, useAutoColor = false) => {
  const mb = new MatrixBuffer(width, height);
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  const time = Date.now() / 1000;

  // Helper to get color: if auto, return specific, else return selected
  const c = (specific) => useAutoColor ? specific : colorChar;

  // Scale factor for shapes based on matrix size
  // Base size ~10px. 
  const scale = Math.max(1, Math.min(width, height) / 10);

  switch (patternName) {
    case 'plasma':
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const v = Math.sin(x * 0.1 + time) +
            Math.sin(y * 0.1 + time) +
            Math.sin((x + y) * 0.1 + time) +
            Math.sin(Math.sqrt(x * x + y * y) * 0.1 + time);
          // v is roughly -4 to 4
          if (v > 1) mb.setPixel(x, y, useAutoColor ? 'C' : colorChar);
          else if (v > 0) mb.setPixel(x, y, useAutoColor ? 'B' : colorChar);
          else if (v > -1) mb.setPixel(x, y, useAutoColor ? 'M' : colorChar);
        }
      }
      break;

    case 'fire-real':
      // Simplex-ish noise or cellular automata would be better, but let's do a sine-based fire
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          // Higher y (bottom) = more intense
          const baseIntensity = (y / height); // 0 at top, 1 at bottom
          const noise = Math.sin(x * 0.5 + time * 2 + y * 0.2) * 0.2 +
            Math.sin(x * 0.2 - time * 3) * 0.2;

          const intensity = baseIntensity + noise;

          if (intensity > 0.8) mb.setPixel(x, y, useAutoColor ? 'R' : colorChar);
          else if (intensity > 0.6) mb.setPixel(x, y, useAutoColor ? 'O' : colorChar);
          else if (intensity > 0.4) mb.setPixel(x, y, useAutoColor ? 'Y' : colorChar);
        }
      }
      break;

    case 'matrix-rain':
      // Falling trails
      const cols = Math.floor(width / scale);
      for (let i = 0; i < cols; i++) {
        const x = Math.floor(i * scale);
        // Random speed and offset based on column index
        const speed = 1 + (i % 3) * 0.5;
        const offset = (time * speed * 5 + i * 10) % (height + 10);
        const headY = Math.floor(offset - 5);

        for (let j = 0; j < 8; j++) { // Trail length 8
          const y = headY - j;
          if (y >= 0 && y < height) {
            // Draw scaled pixel
            const color = j === 0 ? (useAutoColor ? 'W' : colorChar) : (useAutoColor ? 'G' : colorChar);
            // Only draw every other pixel in x to look like code columns
            if (x % 2 === 0 || scale > 1) {
              mb.fillRect(x, y, Math.max(1, Math.floor(scale / 1.5)), 1, color);
            }
          }
        }
      }
      break;

    case 'heart':
      const heartColor = c('R');
      // Implicit heart equation: (x^2 + y^2 - 1)^3 - x^2*y^3 = 0
      // Scaled to fit
      const hScale = Math.min(width, height) / 3;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Normalize to -1.5 to 1.5
          const nx = (x - cx) / hScale;
          const ny = -(y - cy) / hScale; // Flip Y
          const eq = Math.pow(nx * nx + ny * ny - 1, 3) - nx * nx * Math.pow(ny, 3);
          if (eq <= 0) mb.setPixel(x, y, heartColor);
        }
      }
      break;

    case 'leaf':
      // Simple parametric or just scaled shape
      // Let's do a simple ellipse-like shape for leaf
      const leafColor = c('G');
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const nx = (x - cx) / (width / 3);
          const ny = (y - cy) / (height / 3);
          // Rotated ellipse
          const dist = Math.pow(nx + ny, 2) + Math.pow(nx - ny, 2) * 4;
          if (dist < 1) mb.setPixel(x, y, leafColor);
        }
      }
      break;

    case 'flower':
      const petalColor = c('M');
      const centerColor = c('Y');
      const fRadius = Math.min(width, height) / 2.5;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          // 5 petals
          const r = fRadius * (0.8 + 0.2 * Math.cos(5 * angle + time));

          if (dist < r) {
            if (dist < fRadius * 0.3) mb.setPixel(x, y, centerColor);
            else mb.setPixel(x, y, petalColor);
          }
        }
      }
      break;

    case 'sun':
      const sunCenter = c('Y');
      const sunRay = c('O');
      const sRadius = Math.min(width, height) / 4;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);

          if (dist < sRadius) {
            mb.setPixel(x, y, sunCenter);
          } else if (dist < sRadius * 2) {
            // Rays
            if (Math.cos(8 * angle + time) > 0.5) {
              mb.setPixel(x, y, sunRay);
            }
          }
        }
      }
      break;

    case 'moon':
      const moonColor = c('W');
      const mRadius = Math.min(width, height) / 2.5;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const d1 = Math.sqrt(Math.pow(x - cx + mRadius * 0.3, 2) + Math.pow(y - cy, 2));
          const d2 = Math.sqrt(Math.pow(x - cx - mRadius * 0.3, 2) + Math.pow(y - cy, 2));
          if (d1 < mRadius && d2 > mRadius * 0.8) {
            mb.setPixel(x, y, moonColor);
          }
        }
      }
      break;

    case 'smile':
      const faceColor = c('Y');
      const smRadius = Math.min(width, height) / 2.2;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - cx;
          const dy = y - cy;
          if (dx * dx + dy * dy < smRadius * smRadius) {
            // Eyes
            if (Math.abs(dy + smRadius * 0.3) < smRadius * 0.15 && Math.abs(Math.abs(dx) - smRadius * 0.35) < smRadius * 0.15) {
              mb.setPixel(x, y, '0'); // Black eyes
            }
            // Mouth
            else if (dy > smRadius * 0.2 && dy < smRadius * 0.5 && Math.abs(dx) < smRadius * 0.5) {
              // Simple smile curve
              const curve = (dx * dx) / (smRadius);
              if (dy > smRadius * 0.2 + curve) mb.setPixel(x, y, '0');
              else mb.setPixel(x, y, faceColor);
            }
            else {
              mb.setPixel(x, y, faceColor);
            }
          }
        }
      }
      break;

    case 'sad':
      const sadColor = c('B');
      const sdRadius = Math.min(width, height) / 2.2;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - cx;
          const dy = y - cy;
          if (dx * dx + dy * dy < sdRadius * sdRadius) {
            // Eyes
            if (Math.abs(dy + sdRadius * 0.3) < sdRadius * 0.15 && Math.abs(Math.abs(dx) - sdRadius * 0.35) < sdRadius * 0.15) {
              mb.setPixel(x, y, '0');
            }
            // Mouth (Frown)
            else if (dy > sdRadius * 0.4 && dy < sdRadius * 0.7 && Math.abs(dx) < sdRadius * 0.5) {
              const curve = (dx * dx) / (sdRadius);
              if (dy < sdRadius * 0.7 - curve) mb.setPixel(x, y, '0');
              else mb.setPixel(x, y, sadColor);
            }
            else {
              mb.setPixel(x, y, sadColor);
            }
          }
        }
      }
      break;

    case 'arrow-up':
    case 'arrow-down':
    case 'arrow-left':
    case 'arrow-right':
      const aColor = c('G');
      const as = Math.min(width, height) / 2;
      // Draw lines based on direction
      // Simplified: just draw a cross for now or implement proper scaling logic later
      // Let's stick to simple scalable cross for direction
      for (let i = -as; i < as; i++) {
        if (patternName === 'arrow-up' || patternName === 'arrow-down') mb.setPixel(cx, cy + i, aColor);
        if (patternName === 'arrow-left' || patternName === 'arrow-right') mb.setPixel(cx + i, cy, aColor);
      }
      break;

    case 'fire':
      // Legacy fire (static-ish)
      // Gradient from bottom Red -> Orange -> Yellow
      for (let x = 0; x < width; x++) {
        const h = Math.floor(Math.abs(Math.sin(x * 0.8 + time) * height * 0.8) + 2);
        for (let y = height - 1; y >= height - h && y >= 0; y--) {
          let fireColor = colorChar;
          if (useAutoColor) {
            const distFromBottom = height - 1 - y;
            if (distFromBottom < height * 0.2) fireColor = 'R';
            else if (distFromBottom < height * 0.5) fireColor = 'O';
            else fireColor = 'Y';
          }
          mb.setPixel(x, y, fireColor);
        }
      }
      break;

    case 'rainbow':
      const rainbowColors = ['R', 'O', 'Y', 'G', 'B', 'M', 'C'];
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const idx = Math.floor((x + y + time * 5) / (scale * 2)) % rainbowColors.length;
          mb.setPixel(x, y, useAutoColor ? rainbowColors[Math.abs(idx)] : colorChar);
        }
      }
      break;

    case 'rain':
      const rainColor = c('C');
      for (let x = 0; x < width; x += Math.max(1, Math.floor(scale))) {
        for (let y = 0; y < height; y += Math.max(1, Math.floor(scale))) {
          if ((x + y + Math.floor(time * 10)) % 4 === 0) mb.setPixel(x, y, rainColor);
        }
      }
      break;

    case 'wave':
      const waveColor = c('B');
      const waveTop = c('C');
      for (let x = 0; x < width; x++) {
        const yOffset = Math.floor(Math.sin(x * 0.2 + time * 2) * (height / 4));
        for (let y = cy + yOffset; y < height; y++) {
          mb.setPixel(x, y, (y === cy + yOffset && useAutoColor) ? waveTop : waveColor);
        }
      }
      break;

    case 'sparkle':
    case 'star':
      const starColor = c('Y');
      // Random stars based on time
      const numStars = 5;
      for (let i = 0; i < numStars; i++) {
        const sx = (Math.floor(time * 10 + i * 123)) % width;
        const sy = (Math.floor(time * 20 + i * 456)) % height;
        mb.setPixel(sx, sy, starColor);
        if (scale > 2) {
          mb.setPixel(sx + 1, sy, starColor);
          mb.setPixel(sx - 1, sy, starColor);
          mb.setPixel(sx, sy + 1, starColor);
          mb.setPixel(sx, sy - 1, starColor);
        }
      }
      break;

    case 'diamond':
      const diamondColor = c('C');
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (Math.abs(x - cx) + Math.abs(y - cy) <= Math.min(width, height) / 2) {
            mb.setPixel(x, y, diamondColor);
          }
        }
      }
      break;

    case 'square':
      const sqColor = c('B');
      const sqSize = Math.min(width, height) / 2;
      for (let r = cy - sqSize / 2; r < cy + sqSize / 2; r++) {
        for (let c = cx - sqSize / 2; c < cx + sqSize / 2; c++) {
          mb.setPixel(Math.floor(c), Math.floor(r), sqColor);
        }
      }
      break;

    case 'circle':
      const circColor = c('M');
      const radius = Math.min(width, height) / 2 - 1;
      for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
          if (Math.sqrt(Math.pow(r - cy, 2) + Math.pow(c - cx, 2)) <= radius) {
            mb.setPixel(c, r, circColor);
          }
        }
      }
      break;

    case 'border':
      const borderColor = c('W');
      for (let x = 0; x < width; x++) {
        mb.setPixel(x, 0, borderColor);
        mb.setPixel(x, height - 1, borderColor);
      }
      for (let y = 0; y < height; y++) {
        mb.setPixel(0, y, borderColor);
        mb.setPixel(width - 1, y, borderColor);
      }
      break;

    case 'cross':
      const crossColor = c('R');
      for (let i = 0; i < Math.min(width, height); i++) {
        mb.setPixel(cx - i, cy - i, crossColor);
        mb.setPixel(cx + i, cy + i, crossColor);
        mb.setPixel(cx - i, cy + i, crossColor);
        mb.setPixel(cx + i, cy - i, crossColor);
      }
      break;

    case 'plus':
      const plusColor = c('G');
      for (let y = 0; y < height; y++) mb.setPixel(cx, y, plusColor);
      for (let x = 0; x < width; x++) mb.setPixel(x, cy, plusColor);
      break;

    case 'minus':
      const minusColor = c('O');
      for (let x = 0; x < width; x++) mb.setPixel(x, cy, minusColor);
      break;

    case 'equal':
      const eqColor = c('C');
      for (let x = 0; x < width; x++) {
        mb.setPixel(x, cy - Math.floor(scale), eqColor);
        mb.setPixel(x, cy + Math.floor(scale), eqColor);
      }
      break;

    case 'stripes-horz':
      const shColor = c('Y');
      for (let y = 0; y < height; y += Math.floor(scale * 2)) {
        for (let x = 0; x < width; x++) mb.setPixel(x, y, shColor);
      }
      break;

    case 'stripes-vert':
      const svColor = c('O');
      for (let x = 0; x < width; x += Math.floor(scale * 2)) {
        for (let y = 0; y < height; y++) mb.setPixel(x, y, svColor);
      }
      break;

    case 'diagonal-stripes':
      const dsColor = c('M');
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          if ((x + y) % Math.floor(scale * 3) === 0) mb.setPixel(x, y, dsColor);
        }
      }
      break;

    case 'checker':
      const chColor = c('W');
      const chSize = Math.max(1, Math.floor(scale * 2));
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if ((Math.floor(x / chSize) + Math.floor(y / chSize)) % 2 === 0) mb.setPixel(x, y, chColor);
        }
      }
      break;

    case 'zigzag':
      const zzColor = c('Y');
      const zzScale = Math.max(1, Math.floor(scale));
      for (let x = 0; x < width; x++) {
        const y = cy + (x % (4 * zzScale) < (2 * zzScale) ? x % (2 * zzScale) : (2 * zzScale) - (x % (2 * zzScale)));
        mb.setPixel(x, y, zzColor);
        mb.setPixel(x, y + 1, zzColor);
      }
      break;

    case 'fill':
      mb.clear(colorChar);
      break;

    default:
      // Default fill with selected color
      mb.clear(colorChar);
      break;
  }
  return mb.toMatrix();
};

export const overlayMatrix = (baseMatrix, overlayMatrix, mode, width, height) => {
  // Re-implement using MatrixBuffer concepts if needed, but string array is fine for final composition
  const result = [...baseMatrix];

  for (let r = 0; r < height; r++) {
    if (!result[r]) result[r] = '0'.repeat(width);
    const baseRow = result[r].split('');
    const overlayRow = (overlayMatrix[r] || '0'.repeat(width)).split('');

    for (let c = 0; c < width; c++) {
      const overlayPixel = overlayRow[c] || '0';
      const basePixel = baseRow[c] || '0';

      if (mode === 'overlay') {
        if (overlayPixel !== '0') baseRow[c] = overlayPixel;
      } else if (mode === 'bottom-scroll') {
        // handled in component usually, but here for static overlay
        if (r >= height - 7) {
          if (overlayPixel !== '0') baseRow[c] = overlayPixel;
        }
      } else if (mode === 'middle-scroll') {
        const startY = Math.floor((height - 7) / 2);
        if (r >= startY && r < startY + 7) {
          if (overlayPixel !== '0') baseRow[c] = overlayPixel;
        }
      }
    }
    result[r] = baseRow.join('');
  }
  return result;
};
