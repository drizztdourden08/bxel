/* @layer core @kind logic */
import { updateArtwork } from '../../draft/update-artwork';
import { requireSprite } from '../../read/require-sprite';
import { animationFramePickSchema } from '../../schema/animation-frame-pick-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickAnimFrame } from './pick-anim-frame';
import { pickAnimation } from './pick-animation';

const animationFrameRelease = defineCommand({
  name: COMMAND_NAME.animationFrameRelease,
  scope: 'none',
  schema: animationFramePickSchema,
  run: (draft, input) => {
    const animation = pickAnimation(draft, input.options.animation);
    const { frame } = pickAnimFrame(animation, input.options.frame, 'options.frame');
    const sprite = frame.spriteId === null ? undefined : requireSprite(draft.artwork, frame.spriteId);
    if (sprite?.role !== 'frame') {
      throw fail(ERROR_CODE.INVALID_OPTION, 'The frame has no sprite of its own to release.', { path: 'options.frame' });
    }
    updateArtwork(draft, (artwork) => ({
      ...artwork,
      sprites: artwork.sprites.map((item) => (item.id === sprite.id ? { ...item, role: 'sprite' } : item)),
    }));
  },
});

export { animationFrameRelease };
