/* @layer renderer-app @kind logic */
import type { Corners, Point, ShapeKind } from '@bxel/raster';
import { constrainCorner } from '../../../editor/constrain-corner';
import type { QuickMaskMods } from './useQuickMaskGesture.type';

const quickMaskCorners = (shape: ShapeKind, anchor: Point, at: Point, mods: QuickMaskMods): Corners => {
  const corner = mods.constrain ? constrainCorner(shape, anchor, at) : at;
  return { from: mods.centre ? { x: 2 * anchor.x - corner.x, y: 2 * anchor.y - corner.y } : anchor, to: corner };
};

export { quickMaskCorners };
