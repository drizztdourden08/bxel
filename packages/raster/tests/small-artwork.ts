/* @layer tests @kind test */
import type { Artwork } from '@bxel/document';
import { buildArtwork } from './build-artwork';

const smallArtwork = (): Artwork =>
  buildArtwork([
    {
      id: 'spr_000070',
      name: 'small',
      width: 4,
      height: 4,
      pivot: { x2: 4, y2: 4 },
      frames: ['frm_000072'],
      layers: [{ id: 'lay_000071', name: 'Body', cels: { frm_000072: 'cel_000073' } }],
      cels: { cel_000073: ['....', '.12.', '.34.', '....'] },
    },
  ]);

export { smallArtwork };
