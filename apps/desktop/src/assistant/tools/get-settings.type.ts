/* @layer renderer-app @kind types */
import type { SettingScope } from './settings-scope.type';

type GetSettingsInput = {
  readonly scope: SettingScope;
  readonly target?: string;
  readonly page?: string;
  readonly keys?: readonly string[];
  readonly schema: boolean;
};

export type { GetSettingsInput };
