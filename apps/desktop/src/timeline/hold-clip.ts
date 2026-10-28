/* @layer renderer-app @kind logic */
import { CLIP_BOX } from './frame-clip.constants';
import type { FrameClip } from './frame-clip.type';

const holdClip = (clip: FrameClip | null): void => {
  CLIP_BOX.clip = clip;
};

export { holdClip };
