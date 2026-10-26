/* @layer renderer-app @kind logic */
import { composeMapCell, findTileset, flattenTilemap, mapGeometry, tileStepAt, unionRect } from '@bxel/document';
import type { Rect, TileFrameOf } from '@bxel/document';
import { markDirty } from '../canvas-dirty/mark-dirty';
import { CHANNELS } from '../sheet/sheet.constants';
import type { Animator, MapPixels, TilePlan } from './tile-animation.type';

const keyOf = (layer: string, index: number): string => `${layer}:${index}`;

const writeIndices = (image: MapPixels, table: Uint8Array, indices: Uint8Array, box: Rect): void => {
  for (let row = 0; row < box.height; row += 1) {
    for (let column = 0; column < box.width; column += 1) {
      const from = (indices[row * box.width + column] ?? 0) * CHANNELS;
      image.data.set(table.subarray(from, from + CHANNELS), ((box.y + row) * image.width + box.x + column) * CHANNELS);
    }
  }
};

const createAnimator = (plan: TilePlan, image: MapPixels, table: Uint8Array): Animator => {
  const { artwork, tilemap } = plan;
  const tileset = findTileset(artwork, tilemap.tilesetId);
  const tile = { width: tileset?.tileWidth ?? 1, height: tileset?.tileHeight ?? 1 };
  const geometry = mapGeometry({ columns: tilemap.columns, rows: tilemap.rows, tile, orientation: tilemap.orientation });
  const planned = new Map(plan.cells.map((cell) => [keyOf(cell.layer, cell.index), cell]));
  const steps = new Map<string, number>();
  const frameOf: TileFrameOf = (layer, index) => {
    const slot = keyOf(layer, index);
    return planned.get(slot)?.playback.frames[steps.get(slot) ?? 0] ?? null;
  };
  const paint = (indices: Iterable<number>, frames: TileFrameOf | undefined): void => {
    if (tilemap.orientation) {
      const flat = flattenTilemap(artwork, tilemap.id, frames);
      const whole = { x: 0, y: 0, width: flat.width, height: flat.height };
      writeIndices(image, table, flat.pixels, whole);
      markDirty(image.data, whole);
      return;
    }
    let dirty: Rect | null = null;
    for (const index of indices) {
      const column = index % tilemap.columns;
      const origin = geometry.originOf(column, (index - column) / tilemap.columns);
      const box = { x: origin.x, y: origin.y, width: tile.width, height: tile.height };
      writeIndices(image, table, composeMapCell(artwork, tilemap, index, frames), box);
      dirty = dirty ? unionRect(dirty, box) : box;
    }
    if (dirty) markDirty(image.data, dirty);
  };
  const advance = (now: number): boolean => {
    const changed = new Set<number>();
    for (const cell of plan.cells) {
      const slot = keyOf(cell.layer, cell.index);
      const next = tileStepAt(cell.playback, now, { map: tilemap.id, layer: cell.layer, cell: cell.index });
      if (steps.get(slot) === next) continue;
      steps.set(slot, next);
      changed.add(cell.index);
    }
    if (changed.size === 0) return false;
    paint(changed, frameOf);
    return true;
  };
  const restore = (): void => {
    if (steps.size === 0) return;
    steps.clear();
    paint(new Set(plan.cells.map((cell) => cell.index)), undefined);
  };
  return { advance, restore };
};

export { createAnimator };
