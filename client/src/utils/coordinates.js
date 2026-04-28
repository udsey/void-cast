const EXPLORE_RADIUS = 5000; // Radius for random position generation
const OFFSET = 1000000

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
  const xScaled = Math.round((x) + OFFSET)
  const yScaled = Math.round((y) + OFFSET)
  return `${toBase62(xScaled)}-${toBase62(yScaled)}`
}

// Decode position from URL hash
export function decodePosition(encoded) {
  const [xEncoded, yEncoded] = encoded.split('-')
  console.log('Decoding position - xEncoded:', xEncoded, 'yEncoded:', yEncoded)  // ← Log encoded values
  const x = fromBase62(xEncoded) - OFFSET
  const y = fromBase62(yEncoded) - OFFSET
  console.log('Decoded position - x:', x, 'y:', y)  // ← Log decoded values
  return { x, y };
}


// Decode URL hash back to position
export function generateRandomPosition() {
  return {
    x: Math.random() * EXPLORE_RADIUS * 2 - EXPLORE_RADIUS,
    y: Math.random() * EXPLORE_RADIUS * 2 - EXPLORE_RADIUS,
  }
}


export function isValidPosition(x, y) {
  return (
    x >= -EXPLORE_RADIUS && x <= EXPLORE_RADIUS &&
    y >= -EXPLORE_RADIUS && y <= EXPLORE_RADIUS
  )
}