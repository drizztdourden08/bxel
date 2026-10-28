/* @layer renderer-app @kind logic */
import { MIN_FRAME_MS } from './asset-preview.constants';
import type { PlaybackSpeed } from './asset-preview.type';

const frameDelay = (durationMs: number, speed: PlaybackSpeed): number => Math.max(MIN_FRAME_MS, durationMs / Number(speed));

export { frameDelay };
