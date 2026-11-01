/* @layer renderer-app @kind logic */
import { uiOnly } from '../../ui-context/ui-only';
import { uiState } from '../../ui-context/ui-state';
import type { CommandState } from './command-state.type';

const commandState = (id: string, enabled: boolean): CommandState => {
  const ruled = uiState(id).state;
  return { state: ruled === 'shown' && !enabled ? 'disabled' : ruled, only: uiOnly(id) };
};

export { commandState };
