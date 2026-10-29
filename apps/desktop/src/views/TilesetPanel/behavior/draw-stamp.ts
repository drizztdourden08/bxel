/* @layer renderer-app @kind logic */
import { findSprite, findTile } from '@bxel/document';
import type { Artwork, CellFlags, Tileset } from '@bxel/document';
import type { TileStamp } from '../../../stores/tilemap-store.type';
import { orientStamp } from '../../../tilemap/orient-stamp';
import { tileCanvas } from '../../../tilemap/tile-canvas';
import { cellMatrix } from '../../TilemapCanvas/behavior/cell-matrix';
import { STAMP_BOX } from '../TilesetPanel.constants';

const stampScale = (width: number, height: number): number => Math.max(1, Math.min(STAMP_BOX.maxScale, Math.floor(STAMP_BOX.size / Math.max(width, height))));

const drawStamp = (canvas: HTMLCanvasElement, artwork: Artwork, tileset: Tileset, stamp: { stamp: TileStamp; flags: CellFlags }): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const oriented = orientStamp(stamp.stamp, stamp.flags);
  const { tileWidth: tw, tileHeight: th } = tileset;
  const scale = stampScale(oriented.columns * tw, oriented.rows * th);
  canvas.width = oriented.columns * tw * scale;
  canvas.height = oriented.rows * th * scale;
  ctx.imageSmoothingEnabled = false;
  oriented.keys.forEach((key, at) => {
    const tile = key === 0 ? undefined : findTile(tileset, key);
    const sprite = tile ? findSprite(artwork, tile.spriteId) : undefined;
    const source = sprite ? tileCanvas(artwork, sprite) : null;
    if (!source) return;
    ctx.save();
    ctx.translate((at % oriented.columns) * tw * scale, Math.floor(at / oriented.columns) * th * scale);
    ctx.scale(scale, scale);
    ctx.transform(...cellMatrix(stamp.flags, { width: tw, height: th }));
    ctx.drawImage(source, 0, 0);
    ctx.restore();
  });
};

export { drawStamp };
