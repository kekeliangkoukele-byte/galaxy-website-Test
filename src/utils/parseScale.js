/**
 * Parse Chinese astronomical numeric strings into numeric values.
 * Handles: 万(10⁴), 亿(10⁸), commas, ranges (midpoint), multiplier patterns (X倍Y半径).
 */

// Parse a Chinese numeric expression into a number.
// "254 万" → 2540000, "1,344" → 1344, "16.3 万" → 163000, "10 万 ~ 18 万" → 140000
export function parseChineseNumber(str) {
  if (!str || str === '未知') return null;

  let s = str.trim();

  // Strip parenthetical notes like "（已被严重拉伸）" or "（估计）"
  s = s.replace(/[（(][^)）]*[)）]/g, '').trim();

  // Handle range: "10 万 ~ 18 万" → take midpoint
  const rangeMatch = s.match(/^(.+?)\s*[～~]\s*(.+)$/);
  if (rangeMatch) {
    const a = parseChineseNumber(rangeMatch[1]);
    const b = parseChineseNumber(rangeMatch[2]);
    if (a !== null && b !== null) return (a + b) / 2;
    if (a !== null) return a;
    if (b !== null) return b;
    return null;
  }

  // Remove "约", commas, spaces
  s = s.replace(/约/g, '').replace(/,/g, '').replace(/\s+/g, '');

  // Handle "0（我们所在）" or variations
  if (s === '0' || s.startsWith('0（') || s.startsWith('0(')) return 0;

  // Multiplier pattern: "1.08 倍地球半径" → 1.08 * EARTH_RADIUS_KM
  const multMatch = s.match(/^([\d.]+)\s*倍(.+)$/);
  if (multMatch) {
    const factor = parseFloat(multMatch[1]);
    const reference = multMatch[2];
    if (reference.includes('地球半径')) return factor * EARTH_RADIUS_KM;
    if (reference.includes('木星半径')) return factor * JUPITER_RADIUS_KM;
    if (reference.includes('太阳质量')) return null; // mass, not size
    if (reference.includes('地球质量')) return null;
    if (reference.includes('木星质量')) return null;
    return null;
  }

  // Extract numeric part and multiplier
  // Match: optional decimal number followed by optional 万/亿/千
  const numMatch = s.match(/^([\d.]+)([万亿千万亿千百])?(.*)$/);
  if (!numMatch) return null;

  let value = parseFloat(numMatch[1]);
  if (isNaN(value)) return null;

  const multiplier = numMatch[2];
  if (multiplier === '万') value *= 10000;
  else if (multiplier === '亿') value *= 100000000;
  else if (multiplier === '千') value *= 1000;

  return value;
}

// Unit conversion factors to meters
const LY_TO_M = 9.461e15;
const AU_TO_M = 1.496e11;
const KM_TO_M = 1000;
const EARTH_RADIUS_KM = 6371;
const JUPITER_RADIUS_KM = 69911;
const SOLAR_RADIUS_KM = 696340;

/**
 * Parse a size string and return meters.
 * @param {string} str - Chinese numeric string with unit
 * @param {string} unitHint - 'ly' | 'km' | 'au' | 'earthRadius' | 'jupiterRadius' | null
 * @returns {{ valueMeters: number|null, displayStr: string, isEstimated: boolean }}
 */
export function parseSize(str, unitHint = null) {
  if (!str || str === '未知') {
    return { valueMeters: null, displayStr: str || '未知', isEstimated: true };
  }

  let s = str.trim();
  const isEstimated = s.includes('估计') || s.includes('约');

  // Strip parenthetical notes
  s = s.replace(/[（(][^)）]*[)）]/g, '').trim();

  // Determine unit from string
  let unitMultiplier = KM_TO_M;
  if (unitHint === 'ly' || s.includes('光年')) unitMultiplier = LY_TO_M;
  else if (unitHint === 'au' || s.includes('AU') || s.includes('天文单位')) unitMultiplier = AU_TO_M;
  else if (unitHint === 'km' || s.includes('km') || s.includes('公里')) unitMultiplier = KM_TO_M;
  else if (unitHint === 'earthRadius' || s.includes('地球半径')) {
    const num = parseChineseNumber(s);
    if (num === null) return { valueMeters: null, displayStr: str, isEstimated: true };
    return {
      valueMeters: num * EARTH_RADIUS_KM * KM_TO_M,
      displayStr: str,
      isEstimated: isEstimated || s.includes('估计'),
    };
  }
  else if (unitHint === 'jupiterRadius' || s.includes('木星半径')) {
    const num = parseChineseNumber(s);
    if (num === null) return { valueMeters: null, displayStr: str, isEstimated: true };
    return {
      valueMeters: num * JUPITER_RADIUS_KM * KM_TO_M,
      displayStr: str,
      isEstimated: isEstimated || s.includes('估计'),
    };
  }

  const num = parseChineseNumber(s);
  if (num === null) return { valueMeters: null, displayStr: str, isEstimated: true };

  return {
    valueMeters: num * unitMultiplier,
    displayStr: str,
    isEstimated,
  };
}

/**
 * Convert a human-readable distance/size string to meters.
 * Covers: "X 万光年", "X km", "X AU", "X 倍地球半径", "X 倍木星半径"
 */
export function parseToMeters(str) {
  if (!str || str === '未知') return null;
  const result = parseSize(str);
  return result.valueMeters;
}

const LY = LY_TO_M;
const AU = AU_TO_M;
const KM = KM_TO_M;
const RE = EARTH_RADIUS_KM * KM_TO_M;
const RJ = JUPITER_RADIUS_KM * KM_TO_M;

export { LY_TO_M, AU_TO_M, KM_TO_M, EARTH_RADIUS_KM, JUPITER_RADIUS_KM, SOLAR_RADIUS_KM, LY, AU, KM, RE, RJ };
