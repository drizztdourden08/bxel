/* @layer renderer-app @kind component */
import { PixelThumbnail } from '@drizztdourden08/tessera';
import { findBank } from '@bxel/document';
import { thumbBox } from '../../../pixel-thumb/thumb-box';
import { bankSpriteImage } from '../../../sheet/bank-sprite-image';
import type { SpriteThumbProps } from '../EntryTile.type';

const SpriteThumb = ({ artwork, sprite, box }: SpriteThumbProps) => (
  <PixelThumbnail image={bankSpriteImage(findBank(artwork, sprite.bankId), sprite)} box={thumbBox(box)} lazy />
);

export { SpriteThumb };
