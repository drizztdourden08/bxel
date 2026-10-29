/* @layer renderer-app @kind logic */
import type { Animation } from '@bxel/document';

const animationFacings = (animation: Animation): Record<string, string> => {
  const map: Record<string, string> = {};
  for (const tag of animation.tags) {
    if (tag.facing !== undefined && map[tag.facing] === undefined) map[tag.facing] = tag.id;
  }
  return map;
};

export { animationFacings };
