/* @layer core @kind logic */
import { assemblePng } from './assemble-png';
import { checkImageShape } from './check-image-shape';
import { filterScanlines } from './filter-scanlines';
import { PNG_COLOR_TYPE } from './png-color-type.constants';
import { PNG_ENCODE } from './png-encode.constants';
import type { PngEncodeOptions, PngEncodeResult, RgbaImage } from './png.type';

const encodePngRgba = (image: RgbaImage, options: PngEncodeOptions = {}): PngEncodeResult => {
  const channels = PNG_ENCODE.RGBA_CHANNELS;
  const invalid = checkImageShape(image.width, image.height, image.data.length, channels);
  if (invalid) return invalid;
  const geometry = { stride: image.width * channels, bpp: channels, height: image.height };
  const filtered = filterScanlines(image.data, geometry, options.filter ?? 'adaptive');
  const bytes = assemblePng({
    width: image.width,
    height: image.height,
    bitDepth: 8,
    colorType: PNG_COLOR_TYPE.RGBA,
    extra: [],
    filtered,
  });
  return { ok: true, bytes };
};

export { encodePngRgba };
