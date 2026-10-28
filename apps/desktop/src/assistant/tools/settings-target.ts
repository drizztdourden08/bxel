/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { useProjectStore } from '../../stores/useProjectStore';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { activateTab } from '../../workspace/activate-tab';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { reply } from './reply';
import type { SettingScope } from './settings-scope.type';

const settingsTarget = (scope: SettingScope, target: string | undefined): ToolReply | null => {
  if (target === undefined || scope === 'app') return null;
  if (scope === 'project') {
    const id = useProjectStore.getState().project?.manifest.projectId;
    return id === target ? null : reply(mcpFailure(MCP_ERROR_CODE.SETTING_INVALID, APP_TOOL_TEXT.noProject, { path: 'target' }));
  }
  if (!useWorkspaceStore.getState().tabs.some((tab) => tab.id === target)) return reply(mcpFailure(MCP_ERROR_CODE.SETTING_INVALID, APP_TOOL_TEXT.noTab, { path: 'target' }));
  activateTab(target);
  return null;
};

export { settingsTarget };
