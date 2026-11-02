/* @layer renderer-app @kind logic */
import { GRID_INK, GRID_STEP } from './render-overlay.constants';
import type { ArtLines, LineSet } from './render-overlay.type';

const every = (count: number, step: number): number[] => Array.from({ length: Math.ceil(count / step) - 1 }, (_each, at) => (at + 1) * step);

const scaled = (positions: readonly number[], scale: number, limit: number): number[] =>
  positions.filter((position) => position > 0 && position * scale < limit).map((position) => position * scale);

const artLineSet = (name: 'grid' | 'major' | 'tile' | 'guides', art: ArtLines): LineSet => {
  const { width, height, scale } = art;
  const ink = GRID_INK[name];
  if (name === 'guides') return { ink, columns: scaled(art.guides?.x ?? [], scale, width * scale), rows: scaled(art.guides?.y ?? [], scale, height * scale) };
  const step = GRID_STEP[name];
  return { ink, columns: scaled(every(width, step), scale, width * scale), rows: scaled(every(height, step), scale, height * scale) };
};

export { artLineSet };
