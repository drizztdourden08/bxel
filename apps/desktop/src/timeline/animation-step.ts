/* @layer renderer-app @kind logic */
import type { CommandStep } from '@bxel/document';
import type { AnimationFocus } from './timeline.type';

const animationStep = (focus: Pick<AnimationFocus, 'animation'>, name: string, options: object, ref?: string): CommandStep => ({
  name,
  targets: null,
  options: { animation: focus.animation.id, ...options },
  ...(ref === undefined ? {} : { ref }),
});

export { animationStep };
