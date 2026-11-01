/* @layer core @kind logic */
import type { Grid } from '../grid/grid.type';
import type { LintFinding } from './lint.type';

const scanCells = (grid: Grid, visit: (x: number, y: number) => LintFinding | undefined): LintFinding[] => {
  const found: LintFinding[] = [];
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      const finding = visit(x, y);
      if (finding) found.push(finding);
    }
  }
  return found;
};

export { scanCells };
