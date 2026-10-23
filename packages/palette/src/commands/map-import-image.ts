/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { PaletteBank, Swatch } from '@bxel/document';
import { ditherToPalette } from '../dither-to-palette';
import type { RgbaImage } from '../image.type';
import { mapToPalette } from '../map-to-palette';
import type { MapOptions } from '../palette-map.type';
import { DITHER_SIZE } from './import-mapping.constants';
import type { ImportImage, ImportMapping } from './sprite-import.type';

const slotColor = (slot: Swatch): string => (slot.kind === 'color' ? slot.rgb : '#000000');

const asRgba = ({ rgba, width, height }: ImportImage): RgbaImage => {
  if (rgba.length !== width * height * 4) {
    throw fail(ERROR_CODE.INVALID_OPTION, `The image holds ${rgba.length} bytes, not ${width} x ${height} x 4.`, {
      path: 'options.image.rgba',
    });
  }
  return { data: new Uint8ClampedArray(rgba.buffer, rgba.byteOffset, rgba.byteLength), width, height };
};

const mapImportImage = (image: ImportImage, bank: PaletteBank, mapping: ImportMapping): Uint8Array => {
  const source = asRgba(image);
  const base: MapOptions = {
    palette: bank.slots.map(slotColor),
    transparent: bank.transparent,
    alphaThreshold: mapping.alphaThreshold,
  };
  const size = DITHER_SIZE[mapping.dither];
  if (size === null) return mapToPalette(source, base).pixels;
  return ditherToPalette(source, { ...base, size, originX: mapping.originX, originY: mapping.originY }).pixels;
};

export { mapImportImage };
