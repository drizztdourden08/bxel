/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import type { LayerId } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import type { AnimationFocus } from '../timeline/timeline.type';
import type { EditorTarget } from './editor.type';
import { spriteTarget } from './sprite-target';

const animationTarget = (view: DocumentView, focus: AnimationFocus, layerId: LayerId | null = null): EditorTarget | null => {
  const sprite = focus.frame.spriteId === null ? undefined : findSprite(view.state.artwork, focus.frame.spriteId);
  const target = sprite ? spriteTarget(view, sprite, layerId) : null;
  return target ? { ...target, animation: { animation: focus.animation, frame: focus.frame } } : null;
};

export { animationTarget };
