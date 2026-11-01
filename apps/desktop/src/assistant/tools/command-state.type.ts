/* @layer renderer-app @kind types */
import type { UiVisibility } from '../../ui-context/ui-rule.type';

type CommandState = { readonly state: UiVisibility; readonly only: string | null };

export type { CommandState };
