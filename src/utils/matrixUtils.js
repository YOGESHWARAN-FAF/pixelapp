
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

  getPixel(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.buffer[y][x];
    }
    return '0';
  }

  // Draw text onto the buffer at specific coordinates
  drawText(text, x, y, color) {
    const upperText = text.toUpperCase();
    let currentX = x;

    for (let char of upperText) {
      const charData = FONT[char] || FONT[' '];
      for (let r = 0; r < 7; r++) {
        const rowStr = charData[r];
        for (let c = 0; c < 5; c++) {
          if (rowStr[c] === '1') {
            this.setPixel(currentX + c, y + r, color);
          }
        }
      }
      currentX += 6; // 5px char + 1px space
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
  const startY = Math.floor((height - 7) / 2);
  mb.drawText(text, 0, startY, colorChar);
  return mb.toMatrix();
};

export const generatePattern = (patternName, colorChar, width, height, useAutoColor = false) => {
  const mb = new MatrixBuffer(width, height);
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);

  // Helper to get color: if auto, return specific, else return selected
  const c = (specific) => useAutoColor ? specific : colorChar;

  // Helper for gradients
  const gradientY = (y, colors) => {
    if (!useAutoColor) return colorChar;
    const index = Math.floor((y / height) * colors.length);
    return colors[Math.min(index, colors.length - 1)];
  };

  const gradientX = (x, colors) => {
    if (!useAutoColor) return colorChar;
    const index = Math.floor((x / width) * colors.length);
    return colors[Math.min(index, colors.length - 1)];
  };

  switch (patternName) {
    case 'heart':
      const heartColor = c('R');
      const heartOffsets = [
        [-2, -1], [0, -1], [2, -1],
        [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0],
        [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1],
        [-1, 2], [0, 2], [1, 2],
        [0, 3]
      ];
      heartOffsets.forEach(([dx, dy]) => mb.setPixel(cx + dx, cy + dy - 1, heartColor));
      break;

    case 'leaf':
      // Realtime colors: Dark Green -> Green -> Light Green
      const leafColors = ['G', 'G', 'C'];
      const leafPts = [
        [0, 0], [1, -1], [2, -2], [3, -3], // Stem
        [1, 0], [2, 0], [2, -1], [3, -1], [3, -2], // Body right
        [-1, 1], [-2, 2], [-2, 1], [-1, 0], // Body left
        [0, -1], [0, -2], [-1, -1] // Fill
      ];
      leafPts.forEach(([dx, dy]) => {
        // Color based on distance from center/stem for "real" look
        let color = colorChar;
        if (useAutoColor) {
          const dist = Math.abs(dx) + Math.abs(dy);
          color = dist < 2 ? 'G' : 'L'; // Darker center, lighter edges
        }
        mb.setPixel(cx + dx, cy + dy, color);
      });
      break;

    case 'flower':
      const petalColor = c('M');
      const centerColor = c('Y');
      // Center
      mb.setPixel(cx, cy, centerColor);
      // Petals
      const petals = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]];
      petals.forEach(([dx, dy]) => mb.setPixel(cx + dx, cy + dy, petalColor));
      // Outer petals
      if (width > 8) {
        const outerPetals = [[0, -2], [0, 2], [-2, 0], [2, 0]];
        outerPetals.forEach(([dx, dy]) => mb.setPixel(cx + dx, cy + dy, useAutoColor ? 'P' : petalColor)); // P is not in map, fallback to M or defined
      }
      break;

    case 'sun':
      const sunCenter = c('Y');
      const sunRay = c('O');
      const sunOuter = c('R');

      // Center 3x3
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          mb.setPixel(cx + dx, cy + dy, sunCenter);
        }
      }
      // Rays
      const rays = [
        [0, -2], [0, 2], [-2, 0], [2, 0],
        [-2, -2], [2, -2], [-2, 2], [2, 2],
        [0, -3], [0, 3], [-3, 0], [3, 0]
      ];
      rays.forEach(([dx, dy], i) => {
        const isOuter = Math.abs(dx) > 2 || Math.abs(dy) > 2;
        mb.setPixel(cx + dx, cy + dy, isOuter ? sunOuter : sunRay);
      });
      break;

    case 'moon':
      const moonColor = c('W'); // White/Gray
      const craterColor = c('B'); // Blueish craters? Or just off
      // Crescent shape
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const d1 = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
          const d2 = Math.sqrt(Math.pow(x - (cx + 2), 2) + Math.pow(y - (cy - 1), 2));
          if (d1 < 4 && d2 > 3) {
            mb.setPixel(x, y, moonColor);
          }
        }
      }
      break;

    case 'smile':
      const faceColor = c('Y');
      // Eyes
      mb.setPixel(cx - 2, cy - 2, faceColor);
      mb.setPixel(cx + 2, cy - 2, faceColor);
      // Mouth
      mb.setPixel(cx - 3, cy + 1, faceColor);
      mb.setPixel(cx - 2, cy + 2, faceColor);
      mb.setPixel(cx - 1, cy + 2, faceColor);
      mb.setPixel(cx, cy + 2, faceColor);
      mb.setPixel(cx + 1, cy + 2, faceColor);
      mb.setPixel(cx + 2, cy + 2, faceColor);
      mb.setPixel(cx + 3, cy + 1, faceColor);
      break;

    case 'sad':
      const sadColor = c('B');
      // Eyes
      mb.setPixel(cx - 2, cy - 2, sadColor);
      mb.setPixel(cx + 2, cy - 2, sadColor);
      // Mouth (frown)
      mb.setPixel(cx - 3, cy + 2, sadColor);
      mb.setPixel(cx - 2, cy + 1, sadColor);
      mb.setPixel(cx - 1, cy + 1, sadColor);
      mb.setPixel(cx, cy + 1, sadColor);
      mb.setPixel(cx + 1, cy + 1, sadColor);
      mb.setPixel(cx + 2, cy + 1, sadColor);
      mb.setPixel(cx + 3, cy + 2, sadColor);
      break;

    case 'arrow-up':
      const auColor = c('G');
      for (let y = 0; y < height; y++) {
        if (y < cy + 3 && y > cy - 4) mb.setPixel(cx, y, auColor); // Stem
      }
      // Head
      mb.setPixel(cx - 1, cy - 3, auColor);
      mb.setPixel(cx + 1, cy - 3, auColor);
      mb.setPixel(cx - 2, cy - 2, auColor);
      mb.setPixel(cx + 2, cy - 2, auColor);
      break;

    case 'arrow-down':
      const adColor = c('R');
      for (let y = 0; y < height; y++) {
        if (y < cy + 4 && y > cy - 3) mb.setPixel(cx, y, adColor); // Stem
      }
      // Head
      mb.setPixel(cx - 1, cy + 3, adColor);
      mb.setPixel(cx + 1, cy + 3, adColor);
      mb.setPixel(cx - 2, cy + 2, adColor);
      mb.setPixel(cx + 2, cy + 2, adColor);
      break;

    case 'arrow-left':
      const alColor = c('Y');
      for (let x = 0; x < width; x++) {
        if (x < cx + 4 && x > cx - 3) mb.setPixel(x, cy, alColor); // Stem
      }
      // Head
      mb.setPixel(cx - 3, cy - 1, alColor);
      mb.setPixel(cx - 3, cy + 1, alColor);
      mb.setPixel(cx - 2, cy - 2, alColor);
      mb.setPixel(cx - 2, cy + 2, alColor);
      break;

    case 'arrow-right':
      const arColor = c('C');
      for (let x = 0; x < width; x++) {
        if (x < cx + 3 && x > cx - 4) mb.setPixel(x, cy, arColor); // Stem
      }
      // Head
      mb.setPixel(cx + 3, cy - 1, arColor);
      mb.setPixel(cx + 3, cy + 1, arColor);
      mb.setPixel(cx + 2, cy - 2, arColor);
      mb.setPixel(cx + 2, cy + 2, arColor);
      break;

    case 'fire':
      // Gradient from bottom Red -> Orange -> Yellow
      for (let x = 0; x < width; x++) {
        const h = Math.floor(Math.abs(Math.sin(x * 0.8 + Date.now() / 1000) * height * 0.8) + 2); // Dynamic height if we could, but static for now
        // Use a pseudo-random height based on x for static
        const staticH = Math.floor((Math.sin(x * 234.12) + 1) * height / 2) + 2;

        for (let y = height - 1; y >= height - staticH && y >= 0; y--) {
          let fireColor = colorChar;
          if (useAutoColor) {
            const distFromBottom = height - 1 - y;
            if (distFromBottom < 2) fireColor = 'R';
            else if (distFromBottom < 5) fireColor = 'O';
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
          const idx = Math.floor((x + y) / 2) % rainbowColors.length;
          mb.setPixel(x, y, useAutoColor ? rainbowColors[idx] : colorChar);
        }
      }
      break;

    case 'rain':
      const rainColor = c('C');
      for (let x = 0; x < width; x += 2) {
        for (let y = 0; y < height; y += 3) {
          if ((x + y) % 4 === 0) mb.setPixel(x, y, rainColor);
        }
      }
      break;

    case 'wave':
      const waveColor = c('B');
      const waveTop = c('C');
      for (let x = 0; x < width; x++) {
        const yOffset = Math.floor(Math.sin(x * 0.5) * 2);
        for (let y = cy + yOffset; y < height; y++) {
          mb.setPixel(x, y, (y === cy + yOffset && useAutoColor) ? waveTop : waveColor);
        }
      }
      break;

    case 'sparkle':
    case 'star':
      const starColor = c('Y');
      // Draw a few stars
      const stars = [[cx, cy], [cx - 3, cy - 2], [cx + 3, cy + 2], [cx - 2, cy + 3], [cx + 2, cy - 3]];
      stars.forEach(([sx, sy]) => {
        if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
          mb.setPixel(sx, sy, starColor);
          mb.setPixel(sx, sy - 1, useAutoColor ? 'W' : starColor);
          mb.setPixel(sx, sy + 1, useAutoColor ? 'W' : starColor);
          mb.setPixel(sx - 1, sy, useAutoColor ? 'W' : starColor);
          mb.setPixel(sx + 1, sy, useAutoColor ? 'W' : starColor);
        }
      });
      break;

    case 'diamond':
      const diamondColor = c('C');
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (Math.abs(x - cx) + Math.abs(y - cy) <= 4) {
            mb.setPixel(x, y, diamondColor);
          }
        }
      }
      break;

    case 'square':
      const sqColor = c('B');
      for (let r = 2; r < height - 2; r++) {
        for (let c = cx - 4; c < cx + 4; c++) {
          mb.setPixel(c, r, sqColor);
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
        mb.setPixel(i, i, crossColor);
        mb.setPixel(width - 1 - i, i, crossColor);
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
        mb.setPixel(x, cy - 1, eqColor);
        mb.setPixel(x, cy + 1, eqColor);
      }
      break;

    case 'stripes-horz':
      const shColor = c('Y');
      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x++) mb.setPixel(x, y, shColor);
      }
      break;

    case 'stripes-vert':
      const svColor = c('O');
      for (let x = 0; x < width; x += 2) {
        for (let y = 0; y < height; y++) mb.setPixel(x, y, svColor);
      }
      break;

    case 'diagonal-stripes':
      const dsColor = c('M');
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          if ((x + y) % 3 === 0) mb.setPixel(x, y, dsColor);
        }
      }
      break;

    case 'checker':
      const chColor = c('W');
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if ((x + y) % 2 === 0) mb.setPixel(x, y, chColor);
        }
      }
      break;

    case 'zigzag':
      const zzColor = c('Y');
      for (let x = 0; x < width; x++) {
        const y = cy + (x % 4 < 2 ? x % 2 : 2 - (x % 2)); // 0, 1, 2, 1, 0...
        mb.setPixel(x, y, zzColor);
        mb.setPixel(x, y + 1, zzColor);
      }
      break;

    case 'wifi':
      const wifiColor = c('B');
      // Arcs
      const arcs = [
        { r: 1, w: 1 }, { r: 3, w: 3 }, { r: 5, w: 5 }
      ];
      // Dot
      mb.setPixel(cx, height - 1, wifiColor);
      // Arcs
      for (let r = 1; r < height; r += 2) {
        for (let x = 0; x < width; x++) {
          const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(height - 1 - r, 2)); // Simplified
          // Just draw simple arcs
        }
      }
      // Simple static wifi
      mb.setPixel(cx, height - 2, wifiColor);
      mb.setPixel(cx - 2, height - 4, wifiColor);
      mb.setPixel(cx - 1, height - 4, wifiColor);
      mb.setPixel(cx, height - 4, wifiColor);
      mb.setPixel(cx + 1, height - 4, wifiColor);
      mb.setPixel(cx + 2, height - 4, wifiColor);

      mb.setPixel(cx - 4, height - 6, wifiColor);
      mb.setPixel(cx - 3, height - 6, wifiColor);
      mb.setPixel(cx - 2, height - 6, wifiColor);
      mb.setPixel(cx - 1, height - 6, wifiColor);
      mb.setPixel(cx, height - 6, wifiColor);
      mb.setPixel(cx + 1, height - 6, wifiColor);
      mb.setPixel(cx + 2, height - 6, wifiColor);
      mb.setPixel(cx + 3, height - 6, wifiColor);
      mb.setPixel(cx + 4, height - 6, wifiColor);
      break;

    case 'music':
      const musicColor = c('M');
      // Note
      mb.setPixel(cx - 1, cy + 2, musicColor);
      mb.setPixel(cx, cy + 2, musicColor);
      mb.setPixel(cx + 1, cy + 1, musicColor); // Stem
      mb.setPixel(cx + 1, cy, musicColor);
      mb.setPixel(cx + 1, cy - 1, musicColor);
      mb.setPixel(cx + 1, cy - 2, musicColor);
      mb.setPixel(cx + 2, cy - 2, musicColor); // Flag
      mb.setPixel(cx + 2, cy - 1, musicColor);
      break;

    case 'bell':
      const bellColor = c('Y');
      // Bell shape
      for (let y = cy - 2; y <= cy + 2; y++) {
        for (let x = cx - 2; x <= cx + 2; x++) {
          if (y === cy - 2 && Math.abs(x - cx) > 1) continue;
          if (y === cy + 2 && Math.abs(x - cx) > 2) continue;
          mb.setPixel(x, y, bellColor);
        }
      }
      mb.setPixel(cx, cy - 3, bellColor); // Top
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
