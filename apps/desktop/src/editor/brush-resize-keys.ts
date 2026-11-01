/* @layer renderer-app @kind logic */
import type { HeldKeys } from './transform/transform.type';

const brushResizeKeys = (keys: HeldKeys): boolean => keys.ctrlKey && keys.altKey && !keys.shiftKey;

export { brushResizeKeys };
