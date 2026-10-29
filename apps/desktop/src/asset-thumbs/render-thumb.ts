/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Artwork, AssetKey, BankId } from '@bxel/document';
import type { RgbaImage } from '@bxel/formats';
import { previewOf } from '../asset-overview/preview-of';
import { paletteStrip } from './palette-strip';
import { thumbUrl } from './thumb-url';

const imageOf = (artwork: Artwork, key: AssetKey): RgbaImage | null => {
  if (key.kind === 'palette') {
    const bank = findBank(artwork, key.id as BankId);
    return bank ? paletteStrip(bank) : null;
  }
  const preview = previewOf(artwork, key);
  if (preview.kind === 'image') return preview.image;
  return preview.kind === 'frames' ? (preview.frames[0]?.image ?? null) : null;
};

const renderThumb = (artwork: Artwork, key: AssetKey): string | null => thumbUrl(imageOf(artwork, key));

export { renderThumb };
