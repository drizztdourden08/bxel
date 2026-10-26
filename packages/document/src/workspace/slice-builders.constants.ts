/* @layer core @kind config */
import type { AssetKind } from '../model/asset.type';
import type { SliceBuilder } from './slice-builder.type';
import { sliceAnimation } from './slice-animation';
import { slicePalette } from './slice-palette';
import { sliceSheet } from './slice-sheet';
import { sliceSprite } from './slice-sprite';
import { sliceTilemap } from './slice-tilemap';
import { sliceTileset } from './slice-tileset';

const SLICE_BUILDERS: Readonly<Partial<Record<AssetKind, SliceBuilder>>> = {
  sprite: sliceSprite,
  animation: sliceAnimation,
  sheet: sliceSheet,
  palette: slicePalette,
  tileset: sliceTileset,
  tilemap: sliceTilemap,
};

export { SLICE_BUILDERS };
