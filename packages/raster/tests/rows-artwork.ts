/* @layer tests @kind logic */
import type { CelId, Artwork, SpriteId } from '@bxel/document';
import { brand } from './brand';
import { buildArtwork } from './build-artwork';

const rowsIds = {
  sprite: brand<SpriteId>('spr_000010'),
  cel: brand<CelId>('cel_000014'),
};

const rowsArtwork = (rows: readonly string[]): Artwork =>
  buildArtwork([
    {
      id: 'spr_000010',
      name: 'rows',
      width: rows[0]?.length ?? 0,
      height: rows.length,
      frames: ['frm_000012'],
      layers: [{ id: 'lay_000011', name: 'Body', cels: { frm_000012: 'cel_000014' } }],
      cels: { cel_000014: rows },
    },
  ]);

const emptyArtwork = (width: number, height: number): Artwork =>
  buildArtwork([
    {
      id: 'spr_000010',
      name: 'empty',
      width,
      height,
      frames: ['frm_000012'],
      layers: [{ id: 'lay_000011', name: 'Body' }],
      cels: {},
    },
  ]);

export { emptyArtwork, rowsIds, rowsArtwork };
