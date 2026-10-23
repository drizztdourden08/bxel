/* @layer tests @kind logic */
import type { CelId, LayerId, Project, SpriteId } from '@bxel/document';
import { brand } from './brand';
import { buildProject } from './build-project';

const heartIds = {
  heart: brand<SpriteId>('spr_000010'),
  heartB: brand<SpriteId>('spr_000020'),
  ink: brand<LayerId>('lay_000022'),
  cel: brand<CelId>('cel_000014'),
  celB: brand<CelId>('cel_000024'),
};

const heartProject = (): Project =>
  buildProject([
    {
      id: 'spr_000010',
      name: 'heart',
      width: 8,
      height: 8,
      frames: ['frm_000012', 'frm_000013'],
      layers: [{ id: 'lay_000011', name: 'Body', cels: { frm_000012: 'cel_000014', frm_000013: 'cel_000015' } }],
      cels: {
        cel_000014: ['01100110', '16311331', '13333341', '13333341', '01333410', '00134100', '00011000', '00000000'],
        cel_000015: ['00000000', '00100100', '01611310', '01333410', '00134100', '00011000', '00000000', '00000000'],
      },
    },
    {
      id: 'spr_000020',
      name: 'heart-b',
      width: 8,
      height: 8,
      frames: ['frm_000023'],
      layers: [
        { id: 'lay_000021', name: 'Body', cels: { frm_000023: 'cel_000024' } },
        { id: 'lay_000022', name: 'Ink', locked: true },
      ],
      cels: {
        cel_000024: ['01100110', '16511551', '15555541', '15555541', '01555410', '00154100', '00011000', '00000000'],
      },
    },
  ]);

export { heartIds, heartProject };
