/* @layer renderer-app @kind logic */
import { CLIP_BOX } from './frame-clip.constants';
import type { FrameClip } from './frame-clip.type';

const heldClip = (): FrameClip | null => CLIP_BOX.clip;

export { heldClip };
