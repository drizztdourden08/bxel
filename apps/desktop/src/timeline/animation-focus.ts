/* @layer renderer-app @kind logic */
import { findAnimation } from '@bxel/document';
import type { AnimFrame, AnimFrameId, Animation, AnimationId } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import type { OpenTab } from '../workspace/workspace.type';
import type { AnimationFocus } from './timeline.type';

const validFrame = (animation: Animation, frameId: AnimFrameId | null): AnimFrame | undefined =>
  animation.frames.find((frame) => frame.id === frameId) ?? animation.frames[0];

const animationFocus = (view: DocumentView | null, tab: OpenTab | null | undefined, frameId: AnimFrameId | null): AnimationFocus | null => {
  if (!view || !tab || tab.key.kind !== 'animation' || tab.documentId !== view.state.documentId) return null;
  const animation = findAnimation(view.state.artwork, tab.key.id as AnimationId);
  const frame = animation ? validFrame(animation, frameId) : undefined;
  if (!animation || !frame) return null;
  return { documentId: view.state.documentId, artwork: view.state.artwork, animation, frame, readOnly: view.state.readOnly };
};

export { animationFocus, validFrame };
