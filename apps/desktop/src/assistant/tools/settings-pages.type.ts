/* @layer renderer-app @kind types */
import type { SettingScope } from './settings-scope.type';

type Wanted = { readonly scope: SettingScope; readonly page?: string | undefined; readonly keys?: readonly string[] | undefined; readonly schema: boolean };

export type { Wanted };
