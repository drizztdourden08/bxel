/* @layer renderer-app @kind logic */
import type { AnimationId, TagId } from '@bxel/document';
import { ANIMATION_KEY_PREFIX } from './animation-key.constants';

const animationKey = (animationId: AnimationId, tagId: TagId | null): string => `${ANIMATION_KEY_PREFIX}${animationId}:${tagId ?? ''}`;

export { animationKey };
