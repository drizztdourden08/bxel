/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { useSubjectStore } from '../../properties-subject/useSubjectStore';
import { useProjectStore } from '../../stores/useProjectStore';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { activateTab } from '../../workspace/activate-tab';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { openFileTab } from './open-file-tab';
import { reply } from './reply';
import type { SettingScope } from './settings-scope.type';

const settingsTarget = (scope: SettingScope, target: string | undefined): ToolReply | null => {
  if (target === undefined || scope === 'app') return null;
  if (scope === 'project') {
    const id = useProjectStore.getState().project?.manifest.projectId;
    return id === target ? null : reply(mcpFailure(MCP_ERROR_CODE.SETTING_INVALID, APP_TOOL_TEXT.noProject, { path: 'target' }));
  }
  const byId = useWorkspaceStore.getState().tabs.find((tab) => tab.id === target);
  if (byId) {
    activateTab(byId.id);
    return null;
  }
  const hit = openFileTab(target);
  if (hit === null) return reply(mcpFailure(MCP_ERROR_CODE.SETTING_INVALID, APP_TOOL_TEXT.noTab, { path: 'target' }));
  useSubjectStore.getState().pinTo({ path: hit.path, key: hit.tab.key });
  return null;
};

export { settingsTarget };
