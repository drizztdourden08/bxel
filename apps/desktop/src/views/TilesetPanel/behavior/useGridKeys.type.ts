/* @layer renderer-app @kind types */
import type { RefObject } from 'react';
import type { TilesetModel } from '../TilesetPanel.type';

interface GridKeyInput {
  model: TilesetModel;
  anchor: RefObject<number | null>;
  span: (to: number) => void;
  toggle: (index: number) => void;
}

export type { GridKeyInput };
