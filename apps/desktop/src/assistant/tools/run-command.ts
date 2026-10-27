/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE } from '@bxel/mcp';
import { announce, commands } from '@drizztdourden08/brock-react';
import { actAs } from '../../documents/acting-as';
import { manifestOf } from '../command-manifest/manifest-of';
import type { ToolHandler } from '../assistant.type';
import { activeRevision } from './active-revision';
import { APP_TOOL_TEXT } from './app-tool.constants';
import type { RunCommandInput } from './app-tool-input.type';
import { commandFail } from './command-fail';
import { executeCommand } from './execute-command';
import { guardCommand } from './guard-command';
import { offReason } from './off-reason';
import { parseCommandArgs } from './parse-command-args';
import { reply } from './reply';
import { TOOL_TEXT } from './tools.constants';
import { viewSnapshot } from './view-snapshot';

const runCommand: ToolHandler = async (raw, context) => {
  const input = raw as RunCommandInput;
  const def = commands.list().find((each) => each.id === input.id);
  if (!def) return commandFail(MCP_ERROR_CODE.COMMAND_UNKNOWN, APP_TOOL_TEXT.unknown(input.id), 'id');
  const entry = manifestOf(def.id);
  if (entry.refuse !== null) return commandFail(MCP_ERROR_CODE.COMMAND_REFUSED, entry.refuse);
  const blocked = guardCommand(context, input, entry);
  if (blocked) return blocked;
  const parsed = parseCommandArgs(def.id, entry, input.args);
  if ('failure' in parsed) return parsed.failure;
  const state = commands.describe(def.id);
  if (!state.enabled) return commandFail(MCP_ERROR_CODE.COMMAND_OFF, APP_TOOL_TEXT.off(def.id, state.reason ?? offReason()));
  const { displayName, sessionId } = context.call.session;
  const before = JSON.stringify(viewSnapshot());
  const outcome = await actAs({ actor: sessionId, label: (label) => TOOL_TEXT.labelOf(displayName, label) }, () => executeCommand(def, entry, input, parsed.args));
  if (typeof outcome === 'object' && outcome !== null) return outcome;
  announce(APP_TOOL_TEXT.ranLine(displayName, def.label));
  return reply({
    ok: true,
    ran: outcome === null,
    id: def.id,
    label: def.label,
    revision: activeRevision(),
    viewChanged: JSON.stringify(viewSnapshot()) !== before,
    opened: outcome,
  });
};

export { runCommand };
