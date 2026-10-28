/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { commands } from '@drizztdourden08/brock-react';
import type { CommandDef } from '@drizztdourden08/brock-react';
import { usePendingStore } from '../../stores/usePendingStore';
import type { ManifestEntry } from '../command-manifest/manifest.type';
import { APP_TOOL_TEXT } from './app-tool.constants';
import type { RunCommandInput } from './app-tool-input.type';
import { commandContext } from './command-context';
import { commandFail } from './command-fail';
import { directOf } from './direct-commands';
import { offReason } from './off-reason';
import { openForOwner } from './open-for-owner';
import { settlePending } from './settle-pending';
import type { Args } from './run-command.type';

const executeCommand = async (def: CommandDef, entry: ManifestEntry, input: RunCommandInput, args: Args): Promise<ToolReply | string | null> => {
  if (entry.dialog !== null && input.show) return openForOwner(def, entry, args);
  const direct = directOf(def.id);
  if (entry.dialog !== null && direct === null) return commandFail(MCP_ERROR_CODE.COMMAND_ARGS, APP_TOOL_TEXT.dialog(def.id));
  if (direct !== null) {
    const problem = direct(args);
    return problem === null ? null : commandFail(MCP_ERROR_CODE.COMMAND_OFF, problem);
  }
  const before = usePendingStore.getState().pending;
  const result = await commands.run(def.id, commandContext(args));
  if (!result.ok) return commandFail(MCP_ERROR_CODE.COMMAND_OFF, APP_TOOL_TEXT.off(def.id, result.reason || offReason()));
  const unsettled = settlePending(before);
  return unsettled === null ? null : commandFail(MCP_ERROR_CODE.DOCUMENT_BUSY, unsettled);
};

export { executeCommand };
