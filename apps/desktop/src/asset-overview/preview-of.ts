/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import type { OverviewPreview } from './asset-overview.type';
import { NO_PREVIEW } from './asset-overview.constants';
import { palettePreviewColours } from './palette-preview-colours';
import { sheetPreviewImage } from './sheet-preview-image';
import { spritePreviewFrames } from './sprite-preview-frames';
import { tilemapPreviewImage } from './tilemap-preview-image';
import { tilesetPreviewImage } from './tileset-preview-image';

const previewOf = (artwork: Artwork, key: AssetKey): OverviewPreview => {
  if (key.kind === 'sprite') return spritePreviewFrames(artwork, key.id);
  if (key.kind === 'sheet') return sheetPreviewImage(artwork, key.id);
  if (key.kind === 'palette') return palettePreviewColours(artwork, key.id);
  if (key.kind === 'tileset') return tilesetPreviewImage(artwork, key.id);
  return key.kind === 'tilemap' ? tilemapPreviewImage(artwork, key.id) : NO_PREVIEW;
};

export { previewOf };
