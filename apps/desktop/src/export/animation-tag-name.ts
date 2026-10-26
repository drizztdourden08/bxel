/* @layer renderer-app @kind logic */
import type { Animation } from '@bxel/document';

const animationTagName = (animation: Animation, name: string, facing: string | undefined): string =>
  facing === undefined || animation.directions === 'none'
    ? name
    : animation.directionPattern.replaceAll('{tag}', name).replaceAll('{facing}', facing);

export { animationTagName };
