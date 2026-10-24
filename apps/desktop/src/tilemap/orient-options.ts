/* @layer renderer-app @kind logic */
import type { OrientRequest } from '@bxel/document';
import type { TilemapForm } from './tilemap-form.type';

const orientOptions = (form: TilemapForm): OrientRequest | undefined => {
  if (form.orientation === 'orthogonal') return undefined;
  if (form.orientation === 'isometric') return { kind: 'isometric' };
  const shift = { staggerAxis: form.staggerAxis, staggerIndex: form.staggerIndex };
  if (form.orientation === 'staggered') return { kind: 'staggered', ...shift };
  return { kind: 'hexagonal', ...shift, ...(form.hexSideLength > 0 ? { hexSideLength: form.hexSideLength } : {}) };
};

export { orientOptions };
