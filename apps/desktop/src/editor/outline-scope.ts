/* @layer renderer-app @kind logic */
import type { TargetScope } from '@bxel/document';
import { cellScope } from './cell-scope';
import type { EditorTarget } from './editor.type';

/** The frames an outline reaches: this one, the tag that holds it (this one when none does), or every frame of the sprite. */
const outlineScope = (target: EditorTarget, frames: 'frame' | 'tag' | 'all'): TargetScope => {
  const own = cellScope(target);
  if (frames === 'all') return { ...own, frames: { by: 'all' } };
  if (frames === 'frame') return own;
  const at = target.sprite.frames.findIndex((frame) => frame.id === target.frameId);
  const tag = target.sprite.tags.find((each) => {
    const from = target.sprite.frames.findIndex((frame) => frame.id === each.from);
    const to = target.sprite.frames.findIndex((frame) => frame.id === each.to);
    return from >= 0 && to >= from && at >= from && at <= to;
  });
  return tag ? { ...own, frames: { by: 'tag', name: tag.name } } : own;
};

export { outlineScope };
