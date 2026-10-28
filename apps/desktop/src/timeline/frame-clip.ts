/* @layer renderer-app @kind logic */
import type { FrameClip } from './frame-clip.type';

let held: FrameClip | null = null;

const heldClip = (): FrameClip | null => held;

const holdClip = (clip: FrameClip | null): void => {
  held = clip;
};

export { heldClip, holdClip };
