/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { decodePalette, decodeSprite } from '@bxel/document/native';
import { toDataUrl } from '../export/to-data-url';
import { spritePreview } from '../files/sprite-preview';
import { THUMB_MIME } from './asset-thumbs.constants';
import { paletteStrip } from './palette-strip';
import { thumbUrl } from './thumb-url';

const decodedThumb = (bytes: Uint8Array, kind: string): string | null => {
  if (kind === 'palette') {
    const bank = decodePalette(bytes).slice?.artwork.banks?.[0];
    return bank ? thumbUrl(paletteStrip(bank)) : null;
  }
  if (kind !== 'sprite') return null;
  const content = decodeSprite(bytes).slice?.artwork;
  const png = content ? spritePreview(content as Artwork, content.sprites?.[0]) : null;
  return png === null ? null : toDataUrl(png, THUMB_MIME);
};

export { decodedThumb };
