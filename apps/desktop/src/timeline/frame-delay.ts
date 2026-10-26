/* @layer renderer-app @kind logic */
import { DEFAULT_FRAME_DURATION_MS } from '@bxel/document';
import { currentFocus } from './current-focus';

const frameDelay = (): number => currentFocus()?.frame.durationMs ?? DEFAULT_FRAME_DURATION_MS;

export { frameDelay };
