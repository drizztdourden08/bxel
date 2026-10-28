/* @layer renderer-app @kind logic */
import { isProtectedSettingKey, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { announce, nav, settingsCatalog } from '@drizztdourden08/brock-react';
import type { ToolHandler } from '../assistant.type';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { findSettingItem } from './find-setting-item';
import { reply } from './reply';
import { scopeSource } from './scope-source';
import type { SettingScope } from './settings-scope.type';
import { settingsScope } from './settings-scope';
import type { SetSettingInput } from './set-setting.type';
import { settingsTarget } from './settings-target';
import { writeSetting } from './write-setting';

const fail = (code: string, message: string, path: string): ToolReply => reply(mcpFailure(code, message, { path }));

const storedValue = (scope: SettingScope, key: string): unknown => {
  const source = scopeSource(scope);
  if (source !== null) return source.get(key);
  return settingsCatalog()
    .filter((screen) => settingsScope(screen) === scope)
    .flatMap((screen) => screen.sections.flatMap((section) => [...section.items, ...section.subsections.flatMap((sub) => sub.items)]))
    .find((item) => item.key === key)?.value;
};

const setSetting: ToolHandler = async (raw, context) => {
  const input = raw as SetSettingInput;
  if (isProtectedSettingKey(input.key)) return fail(MCP_ERROR_CODE.SETTING_PROTECTED, APP_TOOL_TEXT.protectedKey, 'key');
  const wrongTarget = settingsTarget(input.scope, input.target);
  if (wrongTarget) return wrongTarget;
  const found = findSettingItem(input.scope, input.key);
  if (!found) return fail(MCP_ERROR_CODE.SETTING_INVALID, APP_TOOL_TEXT.noSetting(input.key), 'key');
  if (!found.item.visible) return fail(MCP_ERROR_CODE.SETTING_INVALID, APP_TOOL_TEXT.notShown, 'key');
  const problem = await writeSetting(input.scope, found, input.value);
  if (problem !== null) return fail(MCP_ERROR_CODE.SETTING_INVALID, problem, 'value');
  if (input.show) nav.open(found.screen.route, { ...(found.screen.params ?? {}), section: found.section });
  announce(APP_TOOL_TEXT.viewLine(context.call.session.displayName, `changed ${found.item.label}`));
  return reply({ ok: true, scope: input.scope, key: input.key, value: storedValue(input.scope, input.key) ?? null, shown: input.show });
};

export { setSetting };
