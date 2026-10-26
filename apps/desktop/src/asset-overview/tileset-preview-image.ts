/* @layer renderer-app @kind logic */
import { findTileset } from '@bxel/document';
import type { Artwork, TilesetId } from '@bxel/document';
import { exportTilesetImage } from '@bxel/formats';
import { tileSheetInput } from '../export/tile-sheet-input';
import type { OverviewPreview } from './asset-overview.type';

const tilesetPreviewImage = (artwork: Artwork, id: string): OverviewPreview => {
  const tileset = findTileset(artwork, id as TilesetId);
  if (!tileset || tileset.tiles.length === 0) return { kind: 'none' };
  const sheet = exportTilesetImage(tileSheetInput(artwork, tileset));
  return sheet.ok ? { kind: 'image', image: sheet.image } : { kind: 'none' };
};

export { tilesetPreviewImage };
