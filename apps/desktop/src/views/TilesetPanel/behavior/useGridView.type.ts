/* @layer renderer-app @kind types */
import type { RefObject } from 'react';
import type { GridView } from '../TilesetPanel.type';

interface GridViewHandle {
  view: GridView;
  ref: RefObject<HTMLElement | null>;
}

export type { GridViewHandle };
