/* @layer tests @kind logic */
import type { CelId, Project, SpriteId } from '@bxel/document';
import { brand } from './brand';
import { buildProject } from './build-project';

const rowsIds = {
  sprite: brand<SpriteId>('spr_000010'),
  cel: brand<CelId>('cel_000014'),
};

const rowsProject = (rows: readonly string[]): Project =>
  buildProject([
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

const emptyProject = (width: number, height: number): Project =>
  buildProject([
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

export { emptyProject, rowsIds, rowsProject };
