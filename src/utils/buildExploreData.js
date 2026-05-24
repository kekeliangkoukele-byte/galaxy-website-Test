import galaxies from '../data/galaxies';
import systems from '../data/systems';
import planets from '../data/planets';
import deepSkyObjects from '../data/deepSkyObjects';
import { parseToMeters, LY, AU, KM, RE, RJ } from './parseScale';
import {
  getConstellationDirection,
  hashDirection,
  distanceToSphereRadius,
  raDecToDirection,
} from './constellationCoords';

// --- Helpers ---

function estimateSystemSizeMeters(sys) {
  if (sys.id === 'solar-system') return 30 * AU;
  if (sys.id === 'trappist1') return 0.07 * AU;
  if (sys.id === 'alpha-centauri') return 1.5 * AU;
  if (sys.id === 'kepler-22') return 0.9 * AU;
  if (sys.id === 'toi-700') return 0.17 * AU;
  if (sys.id === 'kepler-186') return 0.45 * AU;
  if (sys.id === 'kepler-452') return 1.1 * AU;
  if (sys.id === 'hd-209458') return 0.05 * AU;
  if (sys.id === 'lhs-1140') return 0.1 * AU;
  if (sys.starType?.includes('M') || sys.starType?.includes('超冷')) return 0.5 * AU;
  if (sys.starType?.includes('G')) return 30 * AU;
  return 10 * AU;
}

// Map constellation from object name for galaxies / star systems
function inferConstellation(obj) {
  if (obj.constellation) return obj.constellation;
  if (obj.name?.includes('仙女')) return '仙女座';
  if (obj.name?.includes('三角')) return '三角座';
  if (obj.name?.includes('狮子')) return '狮子座';
  if (obj.name?.includes('天龙')) return '天龙座';
  if (obj.name?.includes('船底')) return '船底座';
  if (obj.name?.includes('人马')) return '人马座';
  if (obj.name?.includes('麦哲伦')) return '剑鱼座';
  if (obj.name?.includes('半人马')) return '半人马座';
  return null;
}

// Get direction vector for an object
function getDirection(obj, fallbackId) {
  const constellation = inferConstellation(obj);
  if (constellation) {
    const dir = getConstellationDirection(constellation);
    if (dir) return dir;
  }
  return hashDirection(fallbackId || obj.id);
}

// Planet orbit radius in visualization space
function planetOrbitRadius(distanceFromStarMeters) {
  if (!distanceFromStarMeters || distanceFromStarMeters <= 0) return 0.8;
  const logDist = Math.log10(distanceFromStarMeters);
  return Math.max(0.4, Math.min(3.5, logDist * 0.55 - 4));
}

// --- Main builder ---

export default function buildExploreDataset() {
  const dataset = [];
  const starPositions = {}; // systemId → { x, y, z, sphereRadius }

  // === Galaxies ===
  galaxies.forEach((g) => {
    const sizeM = parseToMeters(g.diameter);
    const distM = parseToMeters(g.distance);
    const dir = getDirection(g, `galaxy-${g.id}`);
    const sphereRadius = distM > 0 ? distanceToSphereRadius(distM) : 0;

    const pos = {
      x: dir.x * sphereRadius,
      y: dir.y * sphereRadius,
      z: dir.z * sphereRadius,
    };

    dataset.push({
      id: `galaxy-${g.id}`,
      name: g.name,
      nameEn: g.nameEn,
      category: 'galaxy',
      sizeMeters: sizeM,
      displaySize: g.diameter,
      color: g.color,
      route: `/galaxy/${g.id}`,
      snippet: g.description?.slice(0, 80) + '…',
      type: g.type,
      isEstimated: false,
      posX: pos.x, posY: pos.y, posZ: pos.z,
      sphereRadius,
    });
  });

  // === Star Systems ===
  systems.forEach((sys) => {
    const sizeM = estimateSystemSizeMeters(sys);
    const distM = parseToMeters(sys.distanceFromEarth);
    const dir = getDirection(sys, `system-${sys.id}`);
    const sphereRadius = distM > 0 ? distanceToSphereRadius(distM) : 0;

    const pos = {
      x: dir.x * sphereRadius,
      y: dir.y * sphereRadius,
      z: dir.z * sphereRadius,
    };

    starPositions[sys.id] = { ...pos, sphereRadius };

    dataset.push({
      id: `system-${sys.id}`,
      name: sys.name,
      nameEn: sys.nameEn,
      category: 'star_system',
      sizeMeters: sizeM,
      displaySize: sys.distanceFromEarth,
      color: sys.starType?.includes('M') || sys.starType?.includes('超冷')
        ? '#f87171' : sys.starType?.includes('G')
        ? '#fbbf24' : '#60a5fa',
      route: `/system/${sys.id}`,
      snippet: sys.description?.slice(0, 80) + '…',
      type: sys.type,
      isEstimated: true,
      posX: pos.x, posY: pos.y, posZ: pos.z,
      sphereRadius,
    });
  });

  // === Deep Sky Objects ===
  const galaxyIds = new Set(galaxies.map((g) => g.id));
  deepSkyObjects.forEach((dso) => {
    // Skip if this DSO IS a galaxy (like M31)
    if (dso.galaxyId && galaxyIds.has(dso.galaxyId)) return;

    const sizeM = parseToMeters(dso.diameter);
    const distM = parseToMeters(dso.distance);
    const dir = getDirection(dso, `dso-${dso.id}`);
    const sphereRadius = distM > 0 ? distanceToSphereRadius(distM) : 14;

    let posX = dir.x * sphereRadius;
    let posY = dir.y * sphereRadius;
    let posZ = dir.z * sphereRadius;

    // If this DSO belongs to another galaxy, offset from that galaxy's position
    if (dso.galaxyId) {
      const galaxyObj = dataset.find((d) => d.id === `galaxy-${dso.galaxyId}`);
      if (galaxyObj) {
        const offsetDir = hashDirection(`dso-offset-${dso.id}`);
        const offset = 1.2;
        posX = galaxyObj.posX + offsetDir.x * offset;
        posY = galaxyObj.posY + offsetDir.y * offset;
        posZ = galaxyObj.posZ + offsetDir.z * offset;
      }
    }

    dataset.push({
      id: `dso-${dso.id}`,
      name: dso.name,
      nameEn: dso.nameEn,
      category: 'deepsky',
      sizeMeters: sizeM,
      displaySize: dso.diameter,
      color: dso.color,
      route: `/deepsky/${dso.id}`,
      snippet: dso.description?.slice(0, 80) + '…',
      type: dso.type,
      isEstimated: false,
      posX, posY, posZ,
      sphereRadius,
    });
  });

  // === Planets ===
  planets.forEach((p) => {
    let sizeM = null;
    if (p.radius && p.radius !== '未知') {
      sizeM = parseToMeters(p.radius);
    }
    if (sizeM === null && p.mass && p.mass !== '未知') {
      const massMatch = p.mass.match(/([\d.]+)\s*倍地球质量/);
      if (massMatch) {
        const massFactor = parseFloat(massMatch[1]);
        const estRadius = Math.cbrt(massFactor) * 6371;
        sizeM = estRadius * 1000;
      }
    }

    const orbitDistM = parseToMeters(p.distanceFromStar);
    const orbitR = planetOrbitRadius(orbitDistM);

    // Position near host star
    let posX = 0, posY = 0, posZ = 0;
    const host = starPositions[p.systemId];
    if (host) {
      const orbitDir = hashDirection(`planet-orbit-${p.id}`);
      posX = host.x + orbitDir.x * orbitR;
      posY = host.y + orbitDir.y * orbitR;
      posZ = host.z + orbitDir.z * orbitR;
    } else {
      // Fallback: orbit around center (e.g. Solar System)
      const orbitDir = hashDirection(`planet-orbit-${p.id}`);
      posX = orbitDir.x * orbitR;
      posY = orbitDir.y * orbitR;
      posZ = orbitDir.z * orbitR;
    }

    const sphereRadius = orbitR;

    dataset.push({
      id: `planet-${p.id}`,
      name: p.name,
      nameEn: p.nameEn,
      category: 'planet',
      sizeMeters: sizeM,
      displaySize: p.radius || '未知',
      color: p.color || '#60a5fa',
      route: `/planet/${p.id}`,
      snippet: p.description?.slice(0, 80) + '…',
      type: p.type,
      isEstimated: sizeM === null || p.radius === '未知',
      posX, posY, posZ,
      sphereRadius,
    });
  });

  return dataset;
}
