/* @layer renderer-app @kind logic */
import { settingsCatalog } from '@drizztdourden08/brock-react';
import type { Found } from './find-setting-item.type';
import type { SettingScope } from './settings-scope.type';
import { settingsScope } from './settings-scope';

const findSettingItem = (scope: SettingScope, key: string): Found | null => {
  for (const screen of settingsCatalog().filter((each) => settingsScope(each) === scope)) {
    for (const section of screen.sections) {
      const item = [...section.items, ...section.subsections.flatMap((sub) => sub.items)].find((each) => each.key === key && (scope === 'app' || each.value !== undefined));
      if (item) return { screen, section: section.id, item };
    }
  }
  return null;
};

export { findSettingItem };
