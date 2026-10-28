/* @layer renderer-app @kind logic */
import type { AnimationId, TagId } from '@bxel/document';

const PREFIX = 'anim:';

const animationKey = (animationId: AnimationId, tagId: TagId | null): string => `${PREFIX}${animationId}:${tagId ?? ''}`;

const parseAnimationKey = (key: string): { animationId: AnimationId; tagId: TagId | null } | null => {
  if (!key.startsWith(PREFIX)) return null;
  const [animationId = '', tagId = ''] = key.slice(PREFIX.length).split(':');
  return animationId === '' ? null : { animationId: animationId as AnimationId, tagId: tagId === '' ? null : (tagId as TagId) };
};

export { animationKey, parseAnimationKey };
