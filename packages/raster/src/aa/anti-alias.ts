/* @layer core @kind logic */
import type { AntiAliasInput, AntiAliasPixel, Grid, Run } from './anti-alias.type';

const at = ({ pixels, width, height }: Grid, x: number, y: number): number => (x < 0 || y < 0 || x >= width || y >= height ? -1 : (pixels[y * width + x] ?? 0));

const turned = (grid: Grid): Grid => {
  const pixels = new Uint8Array(grid.pixels.length);
  for (let y = 0; y < grid.height; y += 1) for (let x = 0; x < grid.width; x += 1) pixels[x * grid.height + y] = at(grid, x, y);
  return { pixels, width: grid.height, height: grid.width };
};

const runEnd = (grid: Grid, edge: number, x: number, y: number): number => {
  let end = x - 1;
  while (at(grid, end + 1, y) === edge) end += 1;
  return end;
};

const eligible = (grid: Grid, input: AntiAliasInput, x: number, y: number): boolean => {
  const here = at(grid, x, y);
  if (here < 0 || here === input.edge) return false;
  return input.inside ? here !== 0 : here === 0;
};

const cornersBeside = (grid: Grid, edge: number, run: Run, next: number): (readonly [number, number])[] => {
  const { x, end, y } = run;
  const right = at(grid, end + 1, next) === edge && at(grid, end, next) !== edge;
  const left = at(grid, x - 1, next) === edge && at(grid, x, next) !== edge;
  return [...(right ? ([[end + 1, y], [end, next]] as const) : []), ...(left ? ([[x - 1, y], [x, next]] as const) : [])];
};

const runCorners = (grid: Grid, input: AntiAliasInput, run: Run): AntiAliasPixel[] => {
  if (run.end - run.x < 1) return [];
  return [run.y - 1, run.y + 1].flatMap((next) =>
    cornersBeside(grid, input.edge, run, next)
      .filter(([cx, cy]) => eligible(grid, input, cx, cy))
      .map(([cx, cy]) => ({ x: cx, y: cy, index: input.mid })),
  );
};

const rowCorners = (grid: Grid, input: AntiAliasInput, y: number): AntiAliasPixel[] => {
  const found: AntiAliasPixel[] = [];
  let x = 0;
  while (x < grid.width) {
    if (at(grid, x, y) !== input.edge) {
      x += 1;
      continue;
    }
    const end = runEnd(grid, input.edge, x, y);
    found.push(...runCorners(grid, input, { x, end, y }));
    x = end + 1;
  }
  return found;
};

const stepCorners = (grid: Grid, input: AntiAliasInput): AntiAliasPixel[] =>
  Array.from({ length: grid.height }, (_, y) => rowCorners(grid, input, y)).flat();

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
