/* @layer renderer-app @kind types */
import type { AnimFrameId } from '@bxel/document';
import type { AnimationFocus } from './timeline.type';

type FramePick = { readonly focus: AnimationFocus; readonly order: readonly AnimFrameId[]; readonly picked: readonly AnimFrameId[] };

export type { FramePick };
