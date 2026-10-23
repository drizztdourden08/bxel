/* @layer core @kind logic */
import { assemblePng } from './assemble-png';
import { buildPaletteChunks } from './build-palette-chunks';
import { checkIndexedImage } from './check-indexed-image';
import { filterScanlines } from './filter-scanlines';
import { packIndices } from './pack-indices';
import { paletteBitDepth } from './palette-bit-depth';
import { PNG_COLOR_TYPE } from './png-color-type.constants';
import type { IndexedImage, PngEncodeOptions, PngEncodeResult } from './png.type';
import { rowStride } from './row-stride';

const encodePngIndexed = (image: IndexedImage, options: PngEncodeOptions = {}): PngEncodeResult => {
  const invalid = checkIndexedImage(image);
  if (invalid) return invalid;
  const entries = image.palette.length / 4;
  const bitDepth = paletteBitDepth(entries);
  const packed = packIndices(image.indices, image.width, image.height, bitDepth);
  const geometry = { stride: rowStride(image.width, bitDepth), bpp: 1, height: image.height };
  const bytes = assemblePng({
    width: image.width,
    height: image.height,
    bitDepth,
    colorType: PNG_COLOR_TYPE.INDEXED,
    extra: buildPaletteChunks(image.palette, entries),
    filtered: filterScanlines(packed, geometry, options.filter ?? 'adaptive'),
  });
  return { ok: true, bytes };
};

export { encodePngIndexed };
