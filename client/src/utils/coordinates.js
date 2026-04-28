const WORLD_SIZE = 1000 // move to .env
const WORLD_SCALE = 10 // move to .env


const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const BASE = BASE62.length

// Convert a number to a base62 string
function toBase62(num){
  if (num === 0) return '0';
  let result = '';
  let n = Math.abs(num);
  while (n > 0) {
    result = BASE62[n % BASE] + result;
    n = Math.floor(n / BASE);
  }
  return result;
}

// Convert a base62 string back to a number
function fromBase62(str) {
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    num = num * BASE + BASE62.indexOf(str[i]);
  }
  return num;
}

// Encode position to short URL hash
export function encodePosition(x, y) {
  const xScaled = Math.round((x + WORLD_SIZE) * WORLD_SCALE)
  const yScaled = Math.round((y + WORLD_SIZE) * WORLD_SCALE)

  const combined = (xScaled << 20) | yScaled
  return toBase62(combined)
}

// Decode position from URL hash
export function decodePosition(encoded) {
  const combined = fromBase62(encoded);
  const yScaled = combined & 0xFFFFF; // Lower 20 bits
  const xScaled = combined >> 20;      // Upper bits
  
  let x = (xScaled / WORLD_SCALE) - WORLD_SIZE;
  let y = (yScaled / WORLD_SCALE) - WORLD_SIZE;

  x = Math.max(-WORLD_SIZE, Math.min(WORLD_SIZE, x));
  y = Math.max(-WORLD_SIZE, Math.min(WORLD_SIZE, y));
  
  return { x, y };
}


// Decode URL hash back to position
export function generateRandomPosition(min = -WORLD_SIZE, max = WORLD_SIZE) {
  return {
    x: Math.random() * (max - min) + min,
    y: Math.random() * (max - min) + min,
  }
}

export const WORLD_BOUNDS = { min: -WORLD_SIZE, max: WORLD_SIZE };