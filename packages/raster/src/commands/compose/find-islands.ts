/* @layer core @kind logic */
import type { Sprite } from '@bxel/document';
import type { Rect } from '../../geometry.type';
import type { IslandRequest } from './compose.type';
import { flood } from './flood-island';
import { islandMask } from './island-mask';
import { mergeNearBoxes } from './merge-near-boxes';
import { readingOrder } from './reading-order';

const findIslands = (sprite: Sprite, request: IslandRequest): Rect[] => {
  const { width, height } = sprite;
  const mask = islandMask(sprite);
  const grid = { mask, seen: new Uint8Array(mask.length), width, height };
  const found: Rect[] = [];
  for (let at = 0; at < mask.length; at += 1) {
    if (mask[at] === 1 && grid.seen[at] === 0) found.push(flood(grid, at));
  }
  return readingOrder(mergeNearBoxes(found, request.merge).filter((box) => Math.min(box.width, box.height) >= request.minSize));
};

export { findIslands };
