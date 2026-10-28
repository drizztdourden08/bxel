/* @layer renderer-app @kind constants */
import type { UiState } from './ui-rule.type';

const SHOWN: UiState = Object.freeze({ state: 'shown', reason: null });

const HIDDEN: UiState = Object.freeze({ state: 'hidden', reason: null });

export { HIDDEN, SHOWN };
