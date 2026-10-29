/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Animation, CommandStep } from '@bxel/document';
import { animationStep } from '../timeline/animation-step';
import { DROP_REF } from './image-drop.constants';

const imageSteps = (animation: Animation, frames: readonly Uint8Array[], request: { at: number; durationMs: number }): CommandStep[] =>
  frames.flatMap((pixels, index) => {
    const at = request.at + index;
    const ref = `${DROP_REF.frame}${index}`;
    const add = animationStep({ animation }, COMMAND_NAME.animationFrameAdd, { source: { kind: 'empty', count: 1 }, at, durationMs: request.durationMs });
    const own = animationStep({ animation }, COMMAND_NAME.animationFrameOwn, { frame: { by: 'index', index: at } }, ref);
    const patch: CommandStep = {
      name: COMMAND_NAME.pixelsPatch,
      targets: { sprites: [{ ref }], layers: { by: 'all' }, frames: { by: 'all' } },
      options: { rect: { x: 0, y: 0, width: animation.width, height: animation.height }, pixels, skipZero: false },
    };
    return pixels.some((value) => value !== 0) ? [add, own, patch] : [add, own];
  });

export { imageSteps };
