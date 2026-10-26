/* @layer renderer-app @kind logic */
import type { Animation } from '@bxel/document';
import { animationTagName } from './animation-tag-name';

const animationClipNames = (animation: Animation): string[] =>
  animation.tags.flatMap((tag) => {
    if (tag.kind === 'span') return [animationTagName(animation, tag.name, tag.facing)];
    const base = animation.tags.find((item) => item.id === tag.of);
    return base?.kind === 'span' ? [animationTagName(animation, base.name, tag.facing)] : [];
  });

export { animationClipNames };
