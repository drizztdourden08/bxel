/* @layer renderer-app @kind logic */
import { isProtectedSettingKey } from '@bxel/mcp';
import { settingsCatalog } from '@drizztdourden08/brock-react';
import type { CatalogItem, CatalogScreen } from '@drizztdourden08/brock-react';
import { APP_TOOL_TEXT } from './app-tool.constants';
import type { Wanted } from './settings-pages.type';
import { settingsScope } from './settings-scope';

const lockOf = (item: CatalogItem): string | null => {
  if (isProtectedSettingKey(item.key)) return APP_TOOL_TEXT.protectedKey;
  if (!item.visible) return APP_TOOL_TEXT.notShown;
  return item.settable || item.source === 'custom' ? null : APP_TOOL_TEXT.notEditable;
};

const itemOf = (item: CatalogItem, schema: boolean) => {
  const why = lockOf(item);
  const open = !isProtectedSettingKey(item.key);
  return {
    key: item.key,
    label: item.label,
    ...(open && item.value !== undefined ? { value: item.value } : {}),
    settable: why === null && item.control.kind !== 'none',
    locked: why !== null,
    why,
    ...(schema ? { ...(item.description === undefined ? {} : { description: item.description }), ...(item.hint === undefined ? {} : { hint: item.hint }), control: { ...item.control } } : {}),
  };
};

const pageOf = (screen: CatalogScreen, wanted: Wanted) => ({
  id: screen.id,
  label: screen.label,
  route: screen.route,
  sections: screen.sections
    .map((section) => ({
      id: section.id,
      title: section.title,
      items: [...section.items, ...section.subsections.flatMap((sub) => sub.items)]
        .filter((item) => wanted.keys === undefined || wanted.keys.includes(item.key))
        .filter((item) => wanted.scope === 'app' || item.value !== undefined)
        .map((item) => itemOf(item, wanted.schema)),
    }))
    .filter((section) => section.items.length > 0),
});

const settingsPages = (wanted: Wanted) =>
  settingsCatalog()
    .filter((screen) => settingsScope(screen) === wanted.scope)
    .filter((screen) => wanted.page === undefined || screen.id === wanted.page || screen.label.toLowerCase() === wanted.page.toLowerCase())
    .map((screen) => pageOf(screen, wanted))
    .filter((page) => page.sections.length > 0);

export { settingsPages };
