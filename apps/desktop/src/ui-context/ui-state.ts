/* @layer renderer-app @kind logic */
import { currentContext } from './current-context';
import { evaluate } from './evaluate';
import type { UiState } from './ui-rule.type';

const uiState = (id: string): UiState => evaluate(id, currentContext());

export { uiState };
