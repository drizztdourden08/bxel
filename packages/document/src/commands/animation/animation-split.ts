/* @layer core @kind logic */
import { addReport } from '../../draft/add-report';
import { dropOrphanFrames } from '../../draft/drop-orphan-frames';
import { updateAnimation } from '../../draft/update-animation';
import { updateArtwork } from '../../draft/update-artwork';
import { animationSplitSchema } from '../../schema/animation-split-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickAnimFrame } from './pick-anim-frame';
import { pickAnimation } from './pick-animation';
import { splitFrames } from './split-frames';

const animationSplit = defineCommand({
  name: COMMAND_NAME.animationSplit,
  scope: 'none',
  schema: animationSplitSchema,
  run: (draft, input) => {
    const animation = pickAnimation(draft, input.options.animation);
    const refs = input.options.frames;
    const targets = new Set(
      refs
        ? refs.map((ref, index) => pickAnimFrame(animation, ref, `options.frames.${index}`).frame.id)
        : animation.frames.map((frame) => frame.id),
    );
    const { frames, promoted, made } = splitFrames(draft, animation, targets);
    updateAnimation(draft, animation.id, (current) => ({ ...current, frames }));
    updateArtwork(draft, (artwork) => ({
      ...artwork,
      sprites: artwork.sprites.map((sprite) => (promoted.has(sprite.id) ? { ...sprite, role: 'sprite' } : sprite)),
    }));
    dropOrphanFrames(draft);
    addReport(draft, 'sprites', made + promoted.size);
  },
});

export { animationSplit };
