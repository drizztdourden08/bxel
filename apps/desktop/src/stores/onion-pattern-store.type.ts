/* @layer renderer-app @kind types */
import type { OnionPattern } from '../timeline/onion.type';

interface OnionPatternState {
  pattern: OnionPattern;
  setPattern: (pattern: OnionPattern) => void;
}

export type { OnionPatternState };
