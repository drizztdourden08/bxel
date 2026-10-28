/* @layer renderer-app @kind constants */
import type { Animation } from '@bxel/document';
import type { Held } from './animation-clip.type';

const HELD = new WeakMap<Animation, Held>();

export { HELD };
