/* @layer core @kind logic */
import type { TilemapExportInput } from './tilemap.type';

const tiledOrientation = (input: TilemapExportInput): Record<string, unknown> => {
  const { orientation } = input;
  if (!orientation) return { orientation: 'orthogonal', renderorder: 'right-down' };
  const stagger = { staggeraxis: orientation.staggerAxis, staggerindex: orientation.staggerIndex };
  if (orientation.kind === 'isometric') return { orientation: 'isometric', renderorder: 'right-down' };
  if (orientation.kind === 'staggered') return { orientation: 'staggered', renderorder: 'right-down', ...stagger };
  return { orientation: 'hexagonal', renderorder: 'right-down', hexsidelength: orientation.hexSideLength, ...stagger };
};

export { tiledOrientation };
