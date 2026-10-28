/* @layer renderer-app @kind types */
import type { SettingScope } from './settings-scope.type';

type SetSettingInput = { readonly scope: SettingScope; readonly target?: string; readonly key: string; readonly value: unknown; readonly show: boolean };

export type { SetSettingInput };
