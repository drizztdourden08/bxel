/* @layer renderer-app @kind logic */
import { uiOnly } from '../../ui-context/ui-only';
import { uiState } from '../../ui-context/ui-state';
import type { UiVisibility } from '../../ui-context/ui-rule.type';

type CommandState = { readonly state: UiVisibility; readonly only: string | null };

const commandState = (id: string, enabled: boolean): CommandState => {
  const ruled = uiState(id).state;
  return { state: ruled === 'shown' && !enabled ? 'disabled' : ruled, only: uiOnly(id) };
};

export type { CommandState };
export { commandState };
