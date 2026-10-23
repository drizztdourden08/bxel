/* @layer core @kind test */
import type { ProjectFixture } from './fixture-to-project';

const heartPairFixture: ProjectFixture = {
  id: 'prj_000001',
  name: 'Heart pair',
  defaultBankId: 'bnk_000002',
  coverSpriteId: 'spr_000010',
  banks: [
    {
      id: 'bnk_000002',
      name: 'Bxel 16',
      cap: 16,
      transparent: true,
      slots: [
        { id: 'sw_000003', kind: 'transparent' },
        { id: 'sw_000004', kind: 'color', rgb: '#140b26', name: 'Night' },
        { id: 'sw_000005', kind: 'color', rgb: '#4b1fa0', name: 'Deep Purple' },
        { id: 'sw_000006', kind: 'color', rgb: '#7b3fe4', name: 'Violet' },
        { id: 'sw_000007', kind: 'color', rgb: '#b02a9c', name: 'Magenta' },
        { id: 'sw_000008', kind: 'color', rgb: '#ff7a8a', name: 'Coral' },
        { id: 'sw_000009', kind: 'color', rgb: '#f4eeff', name: 'Mist' },
      ],
      ramps: [{ id: 'rmp_000030', name: 'Purple', swatches: ['sw_000004', 'sw_000005', 'sw_000006', 'sw_000009'] }],
    },
  ],
  sprites: [
    {
      id: 'spr_000010',
      name: 'heart',
      role: 'sprite',
      bankId: 'bnk_000002',
      width: 8,
      height: 8,
      pivot: { x2: 8, y2: 14 },
      layers: [
        {
          id: 'lay_000011',
          name: 'Body',
          visible: true,
          locked: false,
          cels: { frm_000012: 'cel_000014', frm_000013: 'cel_000015' },
        },
      ],
      frames: [
        { id: 'frm_000012', durationMs: 120 },
        { id: 'frm_000013', durationMs: 80 },
      ],
      tags: [{ id: 'tag_000016', name: 'pulse', from: 'frm_000012', to: 'frm_000013', direction: 'pingpong', repeat: 0 }],
      slices: [],
      cels: {
        cel_000014: { rows: ['01100110', '16311331', '13333341', '13333341', '01333410', '00134100', '00011000', '00000000'] },
        cel_000015: { rows: ['00000000', '00100100', '01611310', '01333410', '00134100', '00011000', '00000000', '00000000'] },
      },
    },
    {
      id: 'spr_000020',
      name: 'heart-b',
      role: 'sprite',
      bankId: 'bnk_000002',
      width: 8,
      height: 8,
      pivot: { x2: 8, y2: 14 },
      layers: [
        { id: 'lay_000021', name: 'Body', visible: true, locked: false, cels: { frm_000023: 'cel_000024' } },
        { id: 'lay_000022', name: 'Ink', visible: true, locked: true, cels: {} },
      ],
      frames: [{ id: 'frm_000023', durationMs: 100 }],
      tags: [],
      slices: [],
      cels: {
        cel_000024: { rows: ['01100110', '16511551', '15555541', '15555541', '01555410', '00154100', '00011000', '00000000'] },
      },
    },
  ],
  sheets: [
    {
      id: 'sht_000040',
      name: 'hearts',
      layout: { kind: 'grid', columns: 2, cellWidth: 8, cellHeight: 8, order: 'rows' },
      spacing: { x: 1, y: 1 },
      margin: 0,
      entries: [
        { spriteId: 'spr_000010', at: { x: 0, y: 0 }, source: null },
        { spriteId: 'spr_000020', at: { x: 9, y: 0 }, source: null },
      ],
    },
  ],
  presets: [
    {
      id: 'exp_000050',
      name: 'Hearts at 4x',
      format: 'png',
      scale: 4,
      scope: { sprites: ['spr_000010', 'spr_000020'], layers: { by: 'all' }, frames: { by: 'all' } },
      sheetId: null,
      pathTemplate: '{sprite}-{frame}.png',
    },
  ],
};

export { heartPairFixture };
