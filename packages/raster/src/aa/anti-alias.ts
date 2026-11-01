/* @layer core @kind logic */
import type { AntiAliasInput, AntiAliasPixel } from './anti-alias.type';

interface Grid {
  readonly pixels: Uint8Array;
  readonly width: number;
  readonly height: number;
}

const at = ({ pixels, width, height }: Grid, x: number, y: number): number => (x < 0 || y < 0 || x >= width || y >= height ? -1 : (pixels[y * width + x] ?? 0));

const turned = (grid: Grid): Grid => {
  const pixels = new Uint8Array(grid.pixels.length);
  for (let y = 0; y < grid.height; y += 1) for (let x = 0; x < grid.width; x += 1) pixels[x * grid.height + y] = at(grid, x, y);
  return { pixels, width: grid.height, height: grid.width };
};

/** The end of the run of edge pixels that starts at x, or x - 1 when there is none. */
const runEnd = (grid: Grid, edge: number, x: number, y: number): number => {
  let end = x - 1;
  while (at(grid, end + 1, y) === edge) end += 1;
  return end;
};

const eligible = (grid: Grid, edge: number, inside: boolean, x: number, y: number): boolean => {
  const here = at(grid, x, y);
  if (here < 0 || here === edge) return false;
  return inside ? here !== 0 : here === 0;
};

/** The two cells at the corner of every step where a horizontal run of the edge colour hands over to the next row. */
const stepCorners = (grid: Grid, input: AntiAliasInput): AntiAliasPixel[] => {
  const found: AntiAliasPixel[] = [];
  const { edge, mid, inside } = input;
  for (let y = 0; y < grid.height; y += 1) {
    let x = 0;
    while (x < grid.width) {
      if (at(grid, x, y) !== edge) {
        x += 1;
        continue;
      }
      const end = runEnd(grid, edge, x, y);
      for (const next of [y - 1, y + 1]) {
        const right = at(grid, end + 1, next) === edge && at(grid, end, next) !== edge;
        const left = at(grid, x - 1, next) === edge && at(grid, x, next) !== edge;
        const corners: (readonly [number, number])[] = [...(right ? [[end + 1, y], [end, next]] as const : []), ...(left ? [[x - 1, y], [x, next]] as const : [])];
        if (end - x < 1) continue;
        for (const [cx, cy] of corners) if (eligible(grid, edge, inside, cx, cy)) found.push({ x: cx, y: cy, index: mid });
      }
      x = end + 1;
    }
  }
  return found;
};

/** Proposes in between pixels that soften the stair steps along lines of one colour. Uses only the colour it is given and changes nothing itself. */
const antiAlias = (input: AntiAliasInput): AntiAliasPixel[] => {
  const grid = { pixels: input.pixels, width: input.width, height: input.height };
  const across = stepCorners(grid, input);
  const down = stepCorners(turned(grid), input).map(({ x, y, index }) => ({ x: y, y: x, index }));
  const seen = new Set<number>();
  return [...across, ...down].filter(({ x, y }) => {
    const key = y * input.width + x;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export { antiAlias };
