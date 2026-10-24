/* @layer core @kind test */
import type { ProjectFixture } from './fixture-to-project';
import { heartPairFixture } from './heart-pair-fixture';

const shape = () => ({
  role: 'sprite' as const,
  bankId: 'bnk_000002',
  width: 4,
  height: 4,
  pivot: { x2: 4, y2: 8 },
  tags: [],
  slices: [],
});

const layerFixture: ProjectFixture = {
  id: 'prj_000001',
  name: 'Layers',
  defaultBankId: 'bnk_000002',
  coverSpriteId: null,
  banks: heartPairFixture.banks,
  sprites: [
    {
      ...shape(),
      id: 'spr_000100',
      name: 'mushroom',
      layers: [
        { id: 'lay_000101', name: 'Shadow', visible: true, locked: false, cels: { frm_000110: 'cel_000120' } },
        { id: 'lay_000102', name: 'Body', visible: true, locked: false, cels: { frm_000110: 'cel_000121', frm_000111: 'cel_000122' } },
        { id: 'lay_000103', name: 'Frozen', visible: true, locked: true, cels: { frm_000110: 'cel_000123' } },
        { id: 'lay_000104', name: 'Paint', visible: true, locked: false, cels: { frm_000110: 'cel_000124' } },
        { id: 'lay_000105', name: 'Ghost', visible: false, locked: false, cels: { frm_000110: 'cel_000125' } },
        { id: 'lay_000106', name: 'Outline', visible: true, locked: false, cels: {} },
      ],
      frames: [
        { id: 'frm_000110', durationMs: 100 },
        { id: 'frm_000111', durationMs: 100 },
      ],
      cels: {
        cel_000120: { rows: ['1100', '1100', '0000', '0000'] },
        cel_000121: { rows: ['0220', '2222', '0000', '0000'] },
        cel_000122: { rows: ['0000', '0220', '2222', '0000'] },
        cel_000123: { rows: ['3000', '0000', '0000', '0000'] },
        cel_000124: { rows: ['0000', '0004', '0000', '0000'] },
        cel_000125: { rows: ['5555', '0000', '0000', '0000'] },
      },
    },
    {
      ...shape(),
      id: 'spr_000200',
      name: 'mushroom-b',
      layers: [
        { id: 'lay_000201', name: 'Body', visible: true, locked: false, cels: { frm_000210: 'cel_000220' } },
        { id: 'lay_000202', name: 'Echo', visible: true, locked: false, cels: { frm_000210: 'cel_000220' } },
        { id: 'lay_000203', name: 'Outline', visible: true, locked: false, cels: { frm_000210: 'cel_000221' } },
      ],
      frames: [{ id: 'frm_000210', durationMs: 100 }],
      cels: {
        cel_000220: { rows: ['0660', '6666', '0000', '0000'] },
        cel_000221: { rows: ['1000', '0000', '0000', '0001'] },
      },
    },
    {
      ...shape(),
      id: 'spr_000300',
      name: 'lonely',
      layers: [{ id: 'lay_000301', name: 'Body', visible: true, locked: false, cels: {} }],
      frames: [{ id: 'frm_000310', durationMs: 100 }],
      cels: {},
    },
  ],
  sheets: [],
  presets: [],
};

export { layerFixture };
