/* @layer core @kind logic */
import { addReport } from '../../draft/add-report';
import { updateAnimation } from '../../draft/update-animation';
import type { AnimFrame, AnimSpanTag, Animation } from '../../model/animation.type';
import { MAX_ANIMATION_FRAMES } from '../../model/animation.constants';
import { animationCells } from '../../read/animation-cells';
import { composeAnimationFrame } from '../../read/compose-animation-frame';
import { animationFacingDrawSchema } from '../../schema/animation-facing-draw-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { buildAnimFrame } from './build-anim-frame';
import { drawnFrameSprite } from './drawn-frame-sprite';
import { pickAnimation } from './pick-animation';

const baseOf = (animation: Animation, facing: string): { mirror: Extract<Animation['tags'][number], { kind: 'mirror' }>; base: AnimSpanTag } => {
  const mirror = animation.tags.find((tag) => tag.kind === 'mirror' && tag.facing === facing);
  const base = mirror?.kind === 'mirror' ? animation.tags.find((tag) => tag.id === mirror.of) : undefined;
  if (mirror?.kind !== 'mirror' || base?.kind !== 'span') {
    throw fail(ERROR_CODE.INVALID_OPTION, `Facing "${facing}" is not a mirror of another facing.`, { path: 'options.facing' });
  }
  return { mirror, base };
};

const animationFacingDraw = defineCommand({
  name: COMMAND_NAME.animationFacingDraw,
  scope: 'none',
  schema: animationFacingDrawSchema,
  run: (draft, input) => {
    const animation = pickAnimation(draft, input.options.animation);
    const { mirror, base } = baseOf(animation, input.options.facing);
    const cells = animationCells(animation, mirror.id);
    if (animation.frames.length + cells.length > MAX_ANIMATION_FRAMES) {
      throw fail(ERROR_CODE.LIMIT_REACHED, `An animation holds up to ${MAX_ANIMATION_FRAMES} frames.`);
    }
    const made: AnimFrame[] = cells.map((cell) => {
      const source = animation.frames.find((frame) => frame.id === cell.frameId);
      const sprite = drawnFrameSprite(draft, animation, composeAnimationFrame(draft.artwork, animation, cell.frameId, cell.flip));
      return buildAnimFrame(draft.ids, { spriteId: sprite.id }, { durationMs: source?.durationMs, pivot: animation.anchor });
    });
    const first = made[0];
    const last = made[made.length - 1];
    if (!first || !last) throw fail(ERROR_CODE.TARGET_EMPTY, 'The mirrored facing has no frames to draw.');
    const drawn: AnimSpanTag = { ...base, id: mirror.id, from: first.id, to: last.id, facing: mirror.facing };
    updateAnimation(draft, animation.id, (current) => ({
      ...current,
      frames: [...current.frames, ...made],
      tags: current.tags.map((tag) => (tag.id === mirror.id ? drawn : tag)),
    }));
    addReport(draft, 'frames', made.length);
  },
});

export { animationFacingDraw };
