/* @layer renderer-app @kind types */
import type { RefObject } from 'react';
import type { TilePaint, TilesetModel } from '../TilesetPanel.type';

interface PressKeys {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

interface GridPressInput {
  model: TilesetModel;
  paint: TilePaint;
  anchor: RefObject<number | null>;
  held: RefObject<number | null>;
  moving: RefObject<number | null>;
  keyOf: (index: number) => number | null;
  span: (to: number) => void;
  toggle: (index: number) => void;
}

export type { GridPressInput, PressKeys };
