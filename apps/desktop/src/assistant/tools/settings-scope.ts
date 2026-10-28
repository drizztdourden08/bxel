/* @layer renderer-app @kind logic */
import type { CatalogScreen } from '@drizztdourden08/brock-react';
import type { SettingScope } from './settings-scope.type';

const settingsScope = (screen: CatalogScreen): SettingScope => {
  const group = screen.group.toLowerCase();
  if (group.includes('asset')) return 'asset';
  return group.includes('project') ? 'project' : 'app';
};

export { settingsScope };
