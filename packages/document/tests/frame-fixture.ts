/* @layer core @kind test */
import type { ArtworkFixture } from './fixture-to-artwork';
import { heartPairFixture } from './heart-pair-fixture';

const common = {
  slices: [],
  pivot: { x2: 2, y2: 4 },
  height: 4,
  width: 4,
  bankId: 'bnk_000002',
  role: 'sprite' as const,
};

const frameFixture: ArtworkFixture = {
  id: 'art_000001',
  name: 'Frames',
  defaultBankId: 'bnk_000002',
  coverSpriteId: null,
  banks: heartPairFixture.banks,
  sprites: [
    {
      ...common,
      id: 'spr_000100',
      name: 'walker',
      layers: [
        {
          id: 'lay_000101',
          name: 'Body',
          visible: true,
          locked: false,
          cels: { frm_000110: 'cel_000120', frm_000111: 'cel_000120', frm_000112: 'cel_000121', frm_000113: 'cel_000122' },
        },
        { id: 'lay_000102', name: 'Fx', visible: true, locked: false, cels: { frm_000110: 'cel_000123' } },
        { id: 'lay_000103', name: 'Frozen', visible: true, locked: true, cels: { frm_000110: 'cel_000124' } },
      ],
      frames: [
        { id: 'frm_000110', durationMs: 100 },
        { id: 'frm_000111', durationMs: 200 },
        { id: 'frm_000112', durationMs: 150 },
        { id: 'frm_000113', durationMs: 50 },
      ],
      tags: [
        { id: 'tag_000130', name: 'run', from: 'frm_000110', to: 'frm_000112', direction: 'pingpong', repeat: 2 },
        { id: 'tag_000131', name: 'idle', from: 'frm_000111', to: 'frm_000111', direction: 'forward', repeat: 0 },
        { id: 'tag_000132', name: 'tail', from: 'frm_000112', to: 'frm_000113', direction: 'reverse', repeat: 0 },
      ],
      cels: {
        cel_000120: { rows: ['1100', '1100', '0000', '0000'] },
        cel_000121: { rows: ['0220', '2222', '0000', '0000'] },
        cel_000122: { rows: ['0000', '0330', '3333', '0000'] },
        cel_000123: { rows: ['4000', '0000', '0000', '0000'] },
        cel_000124: { rows: ['0000', '0005', '0000', '0000'] },
      },
    },
    {
      ...common,
      id: 'spr_000200',
      name: 'single',
      layers: [{ id: 'lay_000201', name: 'Body', visible: true, locked: false, cels: { frm_000210: 'cel_000220' } }],
      frames: [{ id: 'frm_000210', durationMs: 100 }],
      tags: [],
      cels: { cel_000220: { rows: ['6000', '0000', '0000', '0000'] } },
    },
  ],
  sheets: [],
  presets: [],
};

export { frameFixture };
