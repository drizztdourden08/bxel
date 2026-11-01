/* @layer renderer-app @kind logic */
import type { CSSProperties } from 'react';
import type { LayerRowModel } from '../LayerStack.type';

const layerRowStyle = (row: Pick<LayerRowModel, 'colour' | 'depth'>): CSSProperties =>
  ({ '--layer-depth': row.depth, ...(row.colour === null ? {} : { '--layer-tag': row.colour }) }) as CSSProperties;

export { layerRowStyle };
