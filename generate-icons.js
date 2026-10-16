import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createPng(width, height, drawFn) {
  // RGBA buffer
  const stride = width * 4;
  const rawData = Buffer.alloc((stride + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (stride + 1);
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ byte) & 1) {
          crc = (crc >>> 1) ^ 0xedb88320;
        } else {
          crc = crc >>> 1;
        }
        byte = byte >>> 1;
      }
    }
    return (crc ^ -1) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const typeAndData = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(typeAndData), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const idat = chunk('IDAT', compressed);
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, chunk('IHDR', ihdr), idat, iend]);
}

// Ensure public directory exists
const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111A17" />
      <stop offset="100%" stop-color="#0B1110" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B7FF4A" />
      <stop offset="100%" stop-color="#43D98B" />
    </linearGradient>
    <linearGradient id="orange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFAD5A" />
      <stop offset="100%" stop-color="#FF6B6B" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="104" fill="url(#bg)" stroke="#29372F" stroke-width="8" />
  <!-- Dynamic Fitness Bolt & Dumbbell Ring -->
  <circle cx="256" cy="256" r="180" fill="none" stroke="#29372F" stroke-width="16" stroke-dasharray="14 10" />
  <circle cx="256" cy="256" r="180" fill="none" stroke="url(#accent)" stroke-width="16" stroke-dasharray="800" stroke-dashoffset="240" stroke-linecap="round" />
  <!-- Central Lightning/Energy Figure -->
  <path d="M 276 96 L 180 266 L 244 266 L 224 416 L 332 236 L 268 236 Z" fill="url(#accent)" filter="drop-shadow(0 6px 12px rgba(183, 255, 74, 0.4))" />
  <circle cx="340" cy="170" r="18" fill="url(#orange)" />
  <circle cx="172" cy="342" r="14" fill="#B7FF4A" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');

// Fitness Icon Draw function
function drawFitnessIcon(isMaskable) {
  return (x, y, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Background: #0B1110 to #111A17
    const bgR = 11 + Math.floor((x / w) * 6);
    const bgG = 17 + Math.floor((y / h) * 9);
    const bgB = 16 + Math.floor(((x + y) / (w + h)) * 7);

    // Rounded rectangle / squircle for non-maskable
    if (!isMaskable) {
      const radius = w * 0.22;
      const qx = Math.max(Math.abs(x - cx) - (cx - radius), 0);
      const qy = Math.max(Math.abs(y - cy) - (cy - radius), 0);
      if (Math.sqrt(qx * qx + qy * qy) > radius) {
        return [0, 0, 0, 0]; // Transparent outer corners
      }
    }

    // Outer progress ring
    const ringRadius = w * (isMaskable ? 0.28 : 0.35);
    const ringThickness = w * 0.035;
    const distToRing = Math.abs(dist - ringRadius);

    if (distToRing < ringThickness) {
      // Angle for gradient/arc
      const angle = Math.atan2(dy, dx);
      if (angle < 1.2 && angle > -2.4) {
        // Electric Lime #B7FF4A
        return [183, 255, 74, 255];
      }
      // Border #29372F
      return [41, 55, 47, 255];
    }

    // Lightning bolt in center
    // Normalized to -1..1
    const scale = isMaskable ? w * 0.28 : w * 0.34;
    const nx = dx / scale;
    const ny = dy / scale;

    // Approximate bolt shape
    let inBolt = false;
    // Top segment: from (0.2, -0.9) to (-0.4, 0.05) to (0.0, 0.05)
    // Bottom segment: from (-0.1, -0.05) to (0.5, -0.05) to (-0.2, 0.95)
    if (ny >= -0.85 && ny <= 0.05) {
      const leftEdge = -0.4 + (ny + 0.85) * 0.2;
      const rightEdge = 0.25 - (ny + 0.85) * 0.15;
      if (nx >= leftEdge && nx <= rightEdge) inBolt = true;
    }
    if (ny >= -0.05 && ny <= 0.85) {
      const leftEdge = -0.05 - (ny + 0.05) * 0.25;
      const rightEdge = 0.45 - (ny + 0.05) * 0.65;
      if (nx >= leftEdge && nx <= rightEdge) inBolt = true;
    }

    if (inBolt) {
      // Lime gradient
      return [183, 255, 74, 255];
    }

    // Small orange energy dot
    const dotDx = dx - w * (isMaskable ? 0.16 : 0.2);
    const dotDy = dy + h * (isMaskable ? 0.16 : 0.2);
    if (dotDx * dotDx + dotDy * dotDy < (w * 0.04) ** 2) {
      return [255, 173, 90, 255]; // #FFAD5A
    }

    return [bgR, bgG, bgB, 255];
  };
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, drawFitnessIcon(false)));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, drawFitnessIcon(false)));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, drawFitnessIcon(true)));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, drawFitnessIcon(false)));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(32, 32, drawFitnessIcon(false)));

console.log('PWA icons created successfully in public/');
