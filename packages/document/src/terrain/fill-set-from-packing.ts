/* @layer core @kind logic */
import type { TerrainSet, Tileset } from '../model/tilemap.type';
import { tileLayout } from '../read/tile-layout';
import { fillFromLayout } from './fill-from-layout';
import type { PackingFill } from './packing-fill.type';
import { PACKINGS } from './terrain-packing.constants';

const fillSetFromPacking = (tileset: Tileset, sets: readonly TerrainSet[], fill: PackingFill): readonly TerrainSet[] | string => {
  const target = sets.find((each) => each.id === fill.set || each.name === fill.set);
  if (!target) return `No terrain set "${fill.set}" in this tileset.`;
  const packing = PACKINGS.find((each) => each.id === fill.packing);
  if (!packing) return `No packing "${fill.packing}". Use one of ${PACKINGS.map((each) => each.id).join(', ')}.`;
  if (packing.kind !== target.kind) return `The packing ${packing.id} is for ${packing.kind}, the set is ${target.kind}.`;
  const layout = tileLayout(tileset);
  const start = fill.start === undefined ? 0 : (layout.indexOf.get(fill.start) ?? 0);
  return sets.map((each) => (each === target ? fillFromLayout(each, layout, packing, start) : each));
};

export { fillSetFromPacking };
