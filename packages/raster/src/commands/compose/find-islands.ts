/* @layer core @kind logic */
import type { Sprite } from '@bxel/document';
import type { Rect } from '../../geometry.type';
import type { IslandRequest } from './compose.type';

const NEIGHBOURS: readonly (readonly [number, number])[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

/** A pixel is drawn in some cel of the sprite when its index is not 0, which is transparent. */
const maskOf = (sprite: Sprite): Uint8Array => {
  const mask = new Uint8Array(sprite.width * sprite.height);
  for (const cel of Object.values(sprite.cels)) {
    cel.pixels.forEach((value, at) => {
      if (value !== 0) mask[at] = 1;
    });
  }
  return mask;
};

const flood = (mask: Uint8Array, seen: Uint8Array, width: number, height: number, start: number): Rect => {
  const stack = [start];
  seen[start] = 1;
  let left = width;
  let top = height;
  let right = 0;
  let bottom = 0;
  while (stack.length > 0) {
    const at = stack.pop() ?? 0;
    const x = at % width;
    const y = Math.floor(at / width);
    left = Math.min(left, x);
    right = Math.max(right, x);
    top = Math.min(top, y);
    bottom = Math.max(bottom, y);
    for (const [dx, dy] of NEIGHBOURS) {
      const nx = x + dx;
      const ny = y + dy;
      const next = ny * width + nx;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height || mask[next] === 0 || seen[next] === 1) continue;
      seen[next] = 1;
      stack.push(next);
    }
  }
  return { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
};

const near = (a: Rect, b: Rect, gap: number): boolean =>
  a.x - gap <= b.x + b.width && b.x - gap <= a.x + a.width && a.y - gap <= b.y + b.height && b.y - gap <= a.y + a.height;

const union = (a: Rect, b: Rect): Rect => {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return { x, y, width: Math.max(a.x + a.width, b.x + b.width) - x, height: Math.max(a.y + a.height, b.y + b.height) - y };
};

const mergeNear = (boxes: readonly Rect[], gap: number): Rect[] => {
  let list = [...boxes];
  let changed = gap > 0;
  while (changed) {
    changed = false;
    for (let i = 0; i < list.length && !changed; i += 1) {
      for (let j = i + 1; j < list.length && !changed; j += 1) {
        const a = list[i];
        const b = list[j];
        if (a && b && near(a, b, gap)) {
          list = [...list.filter((_box, at) => at !== i && at !== j), union(a, b)];
          changed = true;
        }
      }
    }
  }
  return list;
};

/** Reading order: rows from the top, left to right inside a row. A box joins the row of the first box when it starts in its upper half. */
const readingOrder = (boxes: readonly Rect[]): Rect[] => {
  const byTop = [...boxes].sort((a, b) => a.y - b.y || a.x - b.x);
  const rows: Rect[][] = [];
  for (const box of byTop) {
    const row = rows.at(-1);
    const head = row?.[0];
    if (row && head && box.y < head.y + head.height / 2) row.push(box);
    else rows.push([box]);
  }
  return rows.flatMap((row) => row.sort((a, b) => a.x - b.x));
};

/** The islands of drawn pixels of a sprite: touching pixels (diagonals too) form one box; boxes closer than `merge` pixels join; boxes with a side under `minSize` are dropped. */
const findIslands = (sprite: Sprite, request: IslandRequest): Rect[] => {
  const { width, height } = sprite;
  const mask = maskOf(sprite);
  const seen = new Uint8Array(mask.length);
  const found: Rect[] = [];
  for (let at = 0; at < mask.length; at += 1) {
    if (mask[at] === 1 && seen[at] === 0) found.push(flood(mask, seen, width, height, at));
  }
  return readingOrder(mergeNear(found, request.merge).filter((box) => Math.min(box.width, box.height) >= request.minSize));
};

export { findIslands };
