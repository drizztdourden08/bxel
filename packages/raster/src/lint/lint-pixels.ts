/* @layer core @kind logic */
import { BAND_MIN, LINT_LIMIT, LINT_RULES } from './lint.constants';
import type { LintFinding, LintInput, LintResult, LintRule } from './lint.type';

const SIDES: readonly (readonly [number, number])[] = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const RING: readonly (readonly [number, number])[] = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

interface Grid {
  readonly pixels: Uint8Array;
  readonly width: number;
  readonly height: number;
}

const at = ({ pixels, width, height }: Grid, x: number, y: number): number => (x < 0 || y < 0 || x >= width || y >= height ? 0 : (pixels[y * width + x] ?? 0));

const cell = (rule: LintRule, x: number, y: number, index: number): LintFinding => ({ rule, x, y, width: 1, height: 1, index });

const sameAround = (grid: Grid, x: number, y: number, index: number, offsets: readonly (readonly [number, number])[]): number =>
  offsets.filter(([dx, dy]) => at(grid, x + dx, y + dy) === index).length;

/** A pixel with no neighbour of its own index in the ring of eight. */
const orphans = (grid: Grid): LintFinding[] => {
  const found: LintFinding[] = [];
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      const index = at(grid, x, y);
      if (index !== 0 && sameAround(grid, x, y, index, RING) === 0) found.push(cell('orphan', x, y, index));
    }
  }
  return found;
};

/** The corner pixel of a one pixel line: it touches the line on one horizontal and one vertical side and nowhere else, so pixel perfect drawing would drop it. */
const doubles = (grid: Grid): LintFinding[] => {
  const found: LintFinding[] = [];
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      const index = at(grid, x, y);
      if (index === 0 || sameAround(grid, x, y, index, RING) !== 2) continue;
      const sides = SIDES.filter(([dx, dy]) => at(grid, x + dx, y + dy) === index);
      const first = sides[0];
      const second = sides[1];
      if (sides.length === 2 && first && second && first[0] !== second[0] && first[1] !== second[1]) found.push(cell('double', x, y, index));
    }
  }
  return found;
};

interface Run {
  readonly start: number;
  readonly end: number;
  readonly index: number;
}

const runsOfRow = (grid: Grid, y: number): Run[] => {
  const runs: Run[] = [];
  let x = 0;
  while (x < grid.width) {
    const index = at(grid, x, y);
    let end = x;
    while (end + 1 < grid.width && at(grid, end + 1, y) === index) end += 1;
    if (index !== 0 && end - x + 1 >= BAND_MIN.run) runs.push({ start: x, end, index });
    x = end + 1;
  }
  return runs;
};

const sameSpan = (a: Run, b: Run): boolean => a.start === b.start && a.end === b.end && a.index !== b.index;

/** Rows of runs of different colours that stack with the same extent: parallel stripes that read as banding. Columns are found by turning the grid. */
const horizontalBands = (grid: Grid): LintFinding[] => {
  const found: LintFinding[] = [];
  const rows = Array.from({ length: grid.height }, (_, y) => runsOfRow(grid, y));
  for (let y = 0; y + BAND_MIN.rows <= grid.height; y += 1) {
    for (const run of rows[y] ?? []) {
      let depth = 1;
      let last = run;
      for (let next = y + 1; next < grid.height; next += 1) {
        const stacked = (rows[next] ?? []).find((candidate) => sameSpan(last, candidate));
        if (!stacked) break;
        depth += 1;
        last = stacked;
      }
      const previous = (rows[y - 1] ?? []).some((candidate) => sameSpan(candidate, run));
      if (depth >= BAND_MIN.rows && !previous) found.push({ rule: 'banding', x: run.start, y, width: run.end - run.start + 1, height: depth, index: run.index });
    }
  }
  return found;
};

const turned = (grid: Grid): Grid => {
  const pixels = new Uint8Array(grid.pixels.length);
  for (let y = 0; y < grid.height; y += 1) for (let x = 0; x < grid.width; x += 1) pixels[x * grid.height + y] = at(grid, x, y);
  return { pixels, width: grid.height, height: grid.width };
};

const bands = (grid: Grid): LintFinding[] => [
  ...horizontalBands(grid),
  ...horizontalBands(turned(grid)).map((finding) => ({ ...finding, x: finding.y, y: finding.x, width: finding.height, height: finding.width })),
];

const CHECKS: Readonly<Record<LintRule, (grid: Grid) => LintFinding[]>> = { orphan: orphans, double: doubles, banding: bands };

/** Finds orphan pixels, doubles on one pixel lines and banding stripes in an index buffer. Read only. */
const lintPixels = ({ pixels, width, height, rules = LINT_RULES, limit = LINT_LIMIT }: LintInput): LintResult => {
  const grid = { pixels, width, height };
  const all = LINT_RULES.filter((rule) => rules.includes(rule)).flatMap((rule) => CHECKS[rule](grid));
  return { findings: all.slice(0, limit), total: all.length };
};

export { lintPixels };
