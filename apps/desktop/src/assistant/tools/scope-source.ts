/* @layer renderer-app @kind logic */
import type { ConfigSource } from '../../config-source/config-source.type';
import { SETTINGS_SOURCES } from './settings-sources.constants';
import type { SettingScope } from './settings-scope.type';

const scopeSource = (scope: SettingScope): ConfigSource | null => {
  if (scope === 'asset') return SETTINGS_SOURCES.asset;
  return scope === 'project' ? SETTINGS_SOURCES.project : null;
};

export { scopeSource };
