/* @layer tests @kind logic */
import type { CelId, LayerId, Artwork, SpriteId } from '@bxel/document';
import { brand } from './brand';
import { buildArtwork } from './build-artwork';

const transformIds = {
  wide: brand<SpriteId>('spr_000030'),
  tall: brand<SpriteId>('spr_000040'),
  guarded: brand<SpriteId>('spr_000050'),
  linked: brand<SpriteId>('spr_000060'),
  wideBody: brand<CelId>('cel_000034'),
  wideBodyB: brand<CelId>('cel_000035'),
  wideInk: brand<CelId>('cel_000037'),
  tallBody: brand<CelId>('cel_000043'),
  guardedBody: brand<CelId>('cel_000053'),
  guardedLocked: brand<CelId>('cel_000055'),
  guardedHidden: brand<CelId>('cel_000057'),
  linkedBody: brand<CelId>('cel_000063'),
  wideInkLayer: brand<LayerId>('lay_000036'),
  guardedLockedLayer: brand<LayerId>('lay_000054'),
  guardedHiddenLayer: brand<LayerId>('lay_000056'),
};

const transformArtwork = (): Artwork =>
  buildArtwork([
    {
      id: 'spr_000030',
      name: 'wide',
      width: 3,
      height: 2,
      pivot: { x2: 1, y2: 4 },
      frames: ['frm_000032', 'frm_000033'],
      layers: [
        { id: 'lay_000031', name: 'Body', cels: { frm_000032: 'cel_000034', frm_000033: 'cel_000035' } },
        { id: 'lay_000036', name: 'Ink', cels: { frm_000032: 'cel_000037' } },
      ],
      cels: { cel_000034: ['123', '4.5'], cel_000035: ['5.4', '321'], cel_000037: ['.1.', '..2'] },
    },
    {
      id: 'spr_000040',
      name: 'tall',
      width: 2,
      height: 4,
      pivot: { x2: 3, y2: 2 },
      frames: ['frm_000042'],
      layers: [{ id: 'lay_000041', name: 'Body', cels: { frm_000042: 'cel_000043' } }],
      cels: { cel_000043: ['12', '34', '56', '5.'] },
    },
    {
      id: 'spr_000050',
      name: 'guarded',
      width: 2,
      height: 2,
      pivot: { x2: 1, y2: 1 },
      frames: ['frm_000052'],
      layers: [
        { id: 'lay_000051', name: 'Body', cels: { frm_000052: 'cel_000053' } },
        { id: 'lay_000054', name: 'Lock', locked: true, cels: { frm_000052: 'cel_000055' } },
        { id: 'lay_000056', name: 'Ghost', visible: false, cels: { frm_000052: 'cel_000057' } },
      ],
      cels: { cel_000053: ['12', '34'], cel_000055: ['5.', '.5'], cel_000057: ['.4', '4.'] },
    },
    {
      id: 'spr_000060',
      name: 'linked',
      width: 3,
      height: 1,
      frames: ['frm_000062', 'frm_000064'],
      layers: [{ id: 'lay_000061', name: 'Body', cels: { frm_000062: 'cel_000063', frm_000064: 'cel_000063' } }],
      cels: { cel_000063: ['123'] },
    },
  ]);

export { transformIds, transformArtwork };
