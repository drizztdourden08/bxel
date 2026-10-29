/* @layer renderer-app @kind logic */
import { encodePngRgba, thumbnailRgba } from '@bxel/formats';
import type { RgbaImage } from '@bxel/formats';
import { toDataUrl } from '../export/to-data-url';
import { THUMB_MIME, THUMB_SIDE } from './asset-thumbs.constants';

const thumbUrl = (image: RgbaImage | null): string | null => {
  if (image === null) return null;
  const encoded = encodePngRgba(thumbnailRgba(image, THUMB_SIDE));
  return encoded.ok ? toDataUrl(encoded.bytes, THUMB_MIME) : null;
};

export { thumbUrl };
