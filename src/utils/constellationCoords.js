// Approximate RA (hours) and Dec (degrees) for constellation centers.
// Used to compute rough 3D directions for objects whose constellation is known.
const CONSTELLATION_COORDS = {
  '猎户座':    { ra: 5.5,  dec: 5 },     // Orion
  '金牛座':    { ra: 4.0,  dec: 15 },    // Taurus
  '武仙座':    { ra: 17.0, dec: 30 },    // Hercules
  '天琴座':    { ra: 18.8, dec: 35 },    // Lyra
  '人马座':    { ra: 19.0, dec: -25 },   // Sagittarius
  '巨蛇座':    { ra: 16.0, dec: 10 },    // Serpens
  '仙女座':    { ra: 1.0,  dec: 40 },    // Andromeda
  '剑鱼座':    { ra: 5.4,  dec: -69 },   // Dorado
  '三角座':    { ra: 2.0,  dec: 30 },    // Triangulum
  '狮子座':    { ra: 10.5, dec: 15 },    // Leo
  '天龙座':    { ra: 17.0, dec: 55 },    // Draco
  '船底座':    { ra: 7.5,  dec: -55 },   // Carina
  '天炉座':    { ra: 3.0,  dec: -30 },   // Fornax
  '半人马座':  { ra: 13.0, dec: -50 },   // Centaurus
  '玉夫座':    { ra: 0.5,  dec: -30 },   // Sculptor
  '杜鹃座':    { ra: 1.0,  dec: -72 },   // Tucana (for SMC)
  '小熊座':    { ra: 15.0, dec: 75 },    // Ursa Minor
  '大熊座':    { ra: 11.0, dec: 50 },    // Ursa Major
  '六分仪座':  { ra: 10.0, dec: 0 },     // Sextans
};

/**
 * Convert RA (hours) and Dec (degrees) to a unit direction vector.
 * Coordinate system: +X → vernal equinox (RA=0,Dec=0), +Y → north pole (Dec=+90), +Z → RA=6h,Dec=0
 */
export function raDecToDirection(raHours, decDeg) {
  const raRad = raHours * 15 * (Math.PI / 180);
  const decRad = decDeg * (Math.PI / 180);
  return {
    x: Math.cos(decRad) * Math.cos(raRad),
    y: Math.sin(decRad),
    z: Math.cos(decRad) * Math.sin(raRad),
  };
}

/**
 * Get a unit direction vector for a Chinese constellation name.
 * Returns null if the constellation is not recognized.
 */
export function getConstellationDirection(constellationName) {
  const coords = CONSTELLATION_COORDS[constellationName];
  if (!coords) return null;
  return raDecToDirection(coords.ra, coords.dec);
}

/**
 * Map a real distance in meters to a sphere radius for the 3D visualization.
 * Uses log scale to map ~10^9 m (close planets) to ~10^23 m (distant galaxies)
 * onto sphere radii ~2 to ~25.
 */
export function distanceToSphereRadius(distanceMeters) {
  if (distanceMeters <= 0) return 0;
  const logDist = Math.log10(distanceMeters);
  // map log10 range [9, 23] → sphere radius [2, 26]
  const t = Math.max(0, Math.min(1, (logDist - 9) / 14));
  return 2 + t * 24;
}

/**
 * Deterministic hash-based direction for objects without constellation data.
 * Uses the object ID to produce a pseudo-random but stable direction.
 */
export function hashDirection(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  }
  // Use two different hashes for two angles
  const h1 = ((h * 1103515245 + 12345) >>> 0) / 4294967296;
  const h2 = ((h * 214013 + 2531011) >>> 0) / 4294967296;
  const phi = h1 * Math.PI * 2;
  const theta = Math.acos(2 * h2 - 1);
  return {
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.cos(theta),
    z: Math.sin(theta) * Math.sin(phi),
  };
}

export { CONSTELLATION_COORDS };
