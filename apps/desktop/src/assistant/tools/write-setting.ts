/* @layer renderer-app @kind logic */
import { settings } from '@drizztdourden08/brock-react';
import { catalogCheck } from './catalog-check';
import type { Found } from './find-setting-item.type';
import { scopeSource } from './scope-source';
import type { SettingScope } from './settings-scope.type';
import { APP_TOOL_TEXT } from './app-tool.constants';

const same = (left: unknown, right: unknown): boolean => JSON.stringify(left) === JSON.stringify(right);

const writeAppSetting = (key: string, value: unknown): string | null => {
  const result = settings.set(key, value);
  return result.ok ? null : result.reason;
};

const writeSourceSetting = async (scope: SettingScope, key: string, value: unknown): Promise<string | null> => {
  const source = scopeSource(scope);
  if (source === null) return APP_TOOL_TEXT.notEditable;
  await source.set(key, value);
  await source.flush();
  return same(source.get(key), value) ? null : APP_TOOL_TEXT.notTaken;
};

const writeSetting = async (scope: SettingScope, found: Found, value: unknown): Promise<string | null> => {
  const problem = catalogCheck(found.item.control, value);
  if (problem !== null && found.item.control.kind !== 'none') return problem;
  return scope === 'app' ? writeAppSetting(found.item.key, value) : writeSourceSetting(scope, found.item.key, value);
};

export { writeSetting };
