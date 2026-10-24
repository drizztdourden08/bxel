/* @layer renderer-app @kind constants */
import type { SpriteId } from '@bxel/document';
import type { IdenticalMode, Orientation } from './identical.type';

const SAME_ORIENTATION: readonly Orientation[] = ['none'];

const ALL_ORIENTATIONS: readonly Orientation[] = ['none', 'horizontal', 'vertical', 'both'];

const IDENTICAL_MODES: readonly IdenticalMode[] = ['off', 'same', 'flips'];

const NO_TWINS: ReadonlySet<SpriteId> = new Set();

const DURATION_BYTES = 4;

const HASH_START = 2166136261;

const HASH_PRIME = 16777619;

export { ALL_ORIENTATIONS, DURATION_BYTES, HASH_PRIME, HASH_START, IDENTICAL_MODES, NO_TWINS, SAME_ORIENTATION };
