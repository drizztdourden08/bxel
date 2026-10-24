/* @layer core @kind logic */
import type { PackedSheet, SheetPlacement } from './sheet.type';
import type { RgbaImage } from '../png.type';
import { drawExtruded } from './draw-extruded';

const renderSheet = (
  packed: Pick<PackedSheet, 'width' | 'height'>,
  placements: readonly SheetPlacement[],
  extrude: number,
): RgbaImage => {
  const sheet: RgbaImage = {
    data: new Uint8ClampedArray(packed.width * packed.height * 4),
    width: packed.width,
    height: packed.height,
  };
  for (const placement of placements) drawExtruded(sheet, placement, extrude);
  return sheet;
};

export { renderSheet };
