/* @layer core @kind logic */
import { mirrorCoord } from './mirror-coord';
import { stampOffset } from './stamp-offset';
import type { PointMap, Symmetry } from './symmetry.type';
import { PROBES } from './symmetry-maps.constants';

const signature = (map: PointMap): string => PROBES.map((probe) => `${map(probe).x},${map(probe).y}`).join(';');

const then = (outer: PointMap, inner: PointMap): PointMap => (point) => outer(inner(point));

const mirrorXMap = (symmetry: Symmetry, span: number): PointMap | null => {
  const axis = symmetry.x2 ?? null;
  return axis !== null && symmetry.mirrorX !== false ? (p) => ({ x: mirrorCoord(p.x, axis, span), y: p.y }) : null;
};

const mirrorYMap = (symmetry: Symmetry, span: number): PointMap | null => {
  const axis = symmetry.y2 ?? null;
  return axis !== null && symmetry.mirrorY !== false ? (p) => ({ x: p.x, y: mirrorCoord(p.y, axis, span) }) : null;
};

const diagonalMap = (symmetry: Symmetry): PointMap | null => {
  const x2 = symmetry.x2 ?? null;
  const y2 = symmetry.y2 ?? null;
  if (x2 === null || y2 === null || symmetry.diagonal !== true) return null;
  const shift = Math.trunc((x2 - y2) / 2);
  return (p) => ({ x: shift + p.y, y: p.x - shift });
};

const turnMap = (symmetry: Symmetry, span: number): PointMap | null => {
  const x2 = symmetry.x2 ?? null;
  const y2 = symmetry.y2 ?? null;
  if (x2 === null || y2 === null || symmetry.turn4 !== true) return null;
  const shift = Math.trunc((x2 - y2) / 2);
  const sum = Math.floor((x2 + y2) / 2);
  const reach = 2 * stampOffset(span);
  return (p) => ({ x: sum - p.y + reach - span, y: p.x - shift });
};

const generators = (symmetry: Symmetry, span: number): PointMap[] =>
  [mirrorXMap(symmetry, span), mirrorYMap(symmetry, span), diagonalMap(symmetry), turnMap(symmetry, span)].filter((map): map is PointMap => map !== null);

const grow = (found: PointMap[], seen: Set<string>, gens: readonly PointMap[]): boolean => {
  let grew = false;
  for (const gen of gens) {
    for (const known of [...found]) {
      const next = then(gen, known);
      const key = signature(next);
      if (!seen.has(key)) {
        seen.add(key);
        found.push(next);
        grew = true;
      }
    }
  }
  return grew;
};

const symmetryMaps = (symmetry: Symmetry, span: number): PointMap[] => {
  const identity: PointMap = (point) => point;
  const found: PointMap[] = [identity];
  const seen = new Set<string>([signature(identity)]);
  const gens = generators(symmetry, span);
  let grew = true;
  while (grew) grew = grow(found, seen, gens);
  return found;
};

export { symmetryMaps };
