/* @layer renderer-app @kind logic */
import type { SpriteId, TargetScope } from '@bxel/document';
import { cellScope } from '../editor/cell-scope';
import type { EditorTarget } from '../editor/editor.type';
import type { ReplaceScope } from './palette-panel.type';

const everything = (sprites: readonly SpriteId[]): TargetScope => ({ sprites: [...sprites], layers: { by: 'all' }, frames: { by: 'all' } });

const replaceScope = (target: EditorTarget, scope: ReplaceScope): TargetScope => {
  if (scope === 'sprite') return everything([target.sprite.id]);
  if (scope === 'animation' && target.animation) return everything([...new Set(target.animation.animation.frames.flatMap((frame) => (frame.spriteId ? [frame.spriteId] : [])))]);
  return cellScope(target);
};

export { replaceScope };
