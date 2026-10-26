/* @layer renderer-app @kind logic */
import { animationUsers, findSprite } from '@bxel/document';
import type { AnimationFocus } from './timeline.type';

const joined = (names: readonly string[]): string => {
  if (names.length < 2) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} and ${names.at(-1) ?? ''}`;
};

const sharedNote = (focus: AnimationFocus): string | null => {
  const { artwork, animation, frame } = focus;
  const sprite = frame.spriteId === null ? undefined : findSprite(artwork, frame.spriteId);
  if (sprite?.role !== 'sprite') return null;
  const users = animationUsers(artwork, sprite.id);
  const here = users.find((user) => user.animationId === animation.id)?.frames ?? 0;
  const others = users.filter((user) => user.animationId !== animation.id).map((user) => user.name);
  const sheets = artwork.sheets.filter((sheet) => sheet.entries.some((entry) => entry.spriteId === sprite.id)).map((sheet) => sheet.name);
  const names = [...(here > 1 ? [`${here - 1} other ${here === 2 ? 'frame' : 'frames'} of this animation`] : []), ...others, ...sheets];
  return names.length === 0 ? null : `Also used by ${joined(names)}.`;
};

export { sharedNote };
