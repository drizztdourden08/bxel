/* @layer renderer-app @kind logic */
import { HOVER_FRAME_MAX_MS, HOVER_FRAME_MIN_MS } from './asset-thumbs.constants';

const hoverFrameDelay = (durationMs: number): number => Math.min(HOVER_FRAME_MAX_MS, Math.max(HOVER_FRAME_MIN_MS, durationMs));

export { hoverFrameDelay };
