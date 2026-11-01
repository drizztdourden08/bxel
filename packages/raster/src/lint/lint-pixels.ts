/* @layer core @kind logic */
import type { Grid } from '../grid/grid.type';
import { transposeGrid } from '../grid/transpose-grid';
import { BAND_MIN, LINT_LIMIT, LINT_RULES } from './lint.constants';
import type { LintFinding, LintInput, LintResult, LintRule } from './lint.type';
import { RING, SIDES } from './lint-pixels.constants';
import type { Run, Spot } from './lint-pixels.type';
import { scanCells } from './scan-cells';

const at = ({ pixels, width, height }: Grid, x: number, y: number): number => (x < 0 || y < 0 || x >= width || y >= height ? 0 : (pixels[y * width + x] ?? 0));

const cell = (rule: LintRule, x: number, y: number, index: number): LintFinding => ({ rule, x, y, width: 1, height: 1, index });

const sameAround = (grid: Grid, spot: Spot, offsets: readonly (readonly [number, number])[]): number =>
  offsets.filter(([dx, dy]) => at(grid, spot.x + dx, spot.y + dy) === spot.index).length;

const orphans = (grid: Grid): LintFinding[] =>
  scanCells(grid, (x, y) => {
    const index = at(grid, x, y);
    return index !== 0 && sameAround(grid, { x, y, index }, RING) === 0 ? cell('orphan', x, y, index) : undefined;
  });

const doubles = (grid: Grid): LintFinding[] =>
  scanCells(grid, (x, y) => {
    const index = at(grid, x, y);
    if (index === 0 || sameAround(grid, { x, y, index }, RING) !== 2) return undefined;
    const sides = SIDES.filter(([dx, dy]) => at(grid, x + dx, y + dy) === index);
    const first = sides[0];
    const second = sides[1];
    return sides.length === 2 && first && second && first[0] !== second[0] && first[1] !== second[1] ? cell('double', x, y, index) : undefined;
  });

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

const stackDepth = (rows: readonly Run[][], y: number, run: Run): number => {
  let depth = 1;
  let last = run;
  for (let next = y + 1; next < rows.length; next += 1) {
    const stacked = (rows[next] ?? []).find((candidate) => sameSpan(last, candidate));
    if (!stacked) break;
    depth += 1;
    last = stacked;
  }
  return depth;
};

const bandAt = (rows: readonly Run[][], y: number, run: Run): LintFinding | undefined => {
  const depth = stackDepth(rows, y, run);
  const previous = (rows[y - 1] ?? []).some((candidate) => sameSpan(candidate, run));
  if (depth < BAND_MIN.rows || previous) return undefined;
  return { rule: 'banding', x: run.start, y, width: run.end - run.start + 1, height: depth, index: run.index };
};

const horizontalBands = (grid: Grid): LintFinding[] => {
  const found: LintFinding[] = [];
  const rows = Array.from({ length: grid.height }, (_, y) => runsOfRow(grid, y));
  for (let y = 0; y + BAND_MIN.rows <= grid.height; y += 1) {
    for (const run of rows[y] ?? []) {
      const band = bandAt(rows, y, run);
      if (band) found.push(band);
    }
  }
  return found;
};

const bands = (grid: Grid): LintFinding[] => [
  ...horizontalBands(grid),
  ...horizontalBands(transposeGrid(grid)).map((finding) => ({ ...finding, x: finding.y, y: finding.x, width: finding.height, height: finding.width })),
];

const checkFor = (rule: LintRule): ((grid: Grid) => LintFinding[]) => {
  if (rule === 'orphan') return orphans;
  if (rule === 'double') return doubles;
  return bands;
};

const lintPixels = ({ pixels, width, height, rules = LINT_RULES, limit = LINT_LIMIT }: LintInput): LintResult => {
  const grid = { pixels, width, height };
  const all = LINT_RULES.filter((rule) => rules.includes(rule)).flatMap((rule) => checkFor(rule)(grid));
  return { findings: all.slice(0, limit), total: all.length };
};

export { lintPixels };
