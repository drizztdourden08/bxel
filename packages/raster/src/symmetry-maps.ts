/* @layer core @kind logic */
import type { Point } from './geometry.type';
import { mirrorCoord } from './mirror-coord';
import { stampOffset } from './stamp-offset';
import type { PointMap, Symmetry } from './symmetry.type';

const PROBES: readonly Point[] = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
];

const signature = (map: PointMap): string => PROBES.map((probe) => `${map(probe).x},${map(probe).y}`).join(';');

const then = (outer: PointMap, inner: PointMap): PointMap => (point) => outer(inner(point));

const generators = (symmetry: Symmetry, span: number): PointMap[] => {
  const axisX = symmetry.x2 ?? null;
  const axisY = symmetry.y2 ?? null;
  const maps: PointMap[] = [];
  const reach = 2 * stampOffset(span);
  if (axisX !== null) maps.push((p) => ({ x: mirrorCoord(p.x, axisX, span), y: p.y }));
  if (axisY !== null) maps.push((p) => ({ x: p.x, y: mirrorCoord(p.y, axisY, span) }));
  if (axisX !== null && axisY !== null && symmetry.diagonal === true) {
    const shift = Math.trunc((axisX - axisY) / 2);
    maps.push((p) => ({ x: shift + p.y, y: p.x - shift }));
  }
  if (axisX !== null && axisY !== null && symmetry.turn4 === true) {
    const shift = Math.trunc((axisX - axisY) / 2);
    const sum = Math.floor((axisX + axisY) / 2);
    maps.push((p) => ({ x: sum - p.y + reach - span, y: p.x - shift }));
  }
  return maps;
};

const symmetryMaps = (symmetry: Symmetry, span: number): PointMap[] => {
  const identity: PointMap = (point) => point;
  const found: PointMap[] = [identity];
  const seen = new Set<string>([signature(identity)]);
  const gens = generators(symmetry, span);
  for (let again = true; again; ) {
    again = false;
    for (const gen of gens) {
      for (const known of [...found]) {
        const next = then(gen, known);
        const key = signature(next);
        if (!seen.has(key)) {
          seen.add(key);
          found.push(next);
          again = true;
        }
      }
    }
  }
  return found;
};

export { symmetryMaps };
