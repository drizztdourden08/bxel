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

interface GridReleaseInput {
  paint: TilePaint;
  pressed: RefObject<boolean>;
  held: RefObject<number | null>;
  moving: RefObject<number | null>;
  hover: RefObject<number | null>;
  dragged: RefObject<boolean>;
  keyOf: (index: number) => number | null;
}

export type { GridPressInput, GridReleaseInput, PressKeys };
