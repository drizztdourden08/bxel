/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { checkCommand, hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { announce, commands } from '@drizztdourden08/brock-react';
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { actAs } from '../../documents/acting-as';
import { beginPending } from '../../editor/pending/begin-pending';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { usePendingStore } from '../../stores/usePendingStore';
import { ARGS_KINDS } from '../command-manifest/args-schemas.constants';
import { manifestOf } from '../command-manifest/manifest-of';
import type { ManifestEntry } from '../command-manifest/manifest.type';
import type { ToolContext, ToolHandler } from '../assistant.type';
import { APP_TOOL_TEXT } from './app-tool.constants';
import type { RunCommandInput } from './app-tool-input.type';
import { directOf } from './direct-commands';
import { lockedDocument } from './locked-document';
import { lockedFailure } from './locked-failure';
import { offReason } from './off-reason';
import { reply } from './reply';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';
import { viewSnapshot } from './view-snapshot';

type Args = Record<string, unknown>;

const fail = (code: string, message: string, path?: string): ToolReply => reply(mcpFailure(code, message, path === undefined ? {} : { path }));

const activeRevision = (): number | null => {
  const { activeId, host } = useDocumentStore.getState();
  return activeId === null ? null : (host.view(activeId)?.state.revision ?? null);
};

const parseArgs = (id: string, entry: ManifestEntry, given: Args | undefined): { args: Args } | { failure: ToolReply } => {
  if (entry.args === null) {
    return given !== undefined && Object.keys(given).length > 0 ? { failure: fail(MCP_ERROR_CODE.COMMAND_ARGS, APP_TOOL_TEXT.noArgs(id), 'args') } : { args: {} };
  }
  const parsed = ARGS_KINDS[entry.args].safeParse(given ?? {});
  if (parsed.success) return { args: parsed.data };
  const issue = parsed.error.issues[0];
  const where = (issue?.path ?? []).map(String).join('.');
  return { failure: fail(MCP_ERROR_CODE.COMMAND_ARGS, APP_TOOL_TEXT.needsArgs(id, `${where === '' ? 'args' : `args.${where}`}: ${issue?.message ?? 'not valid.'}`), where === '' ? 'args' : `args.${where}`) };
};

const guard = (context: ToolContext, input: RunCommandInput, entry: ManifestEntry): ToolReply | null => {
  const { session } = context.call;
  const denied = checkCommand(session.grant, 'run_command', { what: `run_command ${input.id}`, area: entry.area, changes: entry.effect !== 'show' }, session.displayName);
  if (denied) return reply(denied);
  if (entry.effect !== 'show') {
    const { activeId } = useDocumentStore.getState();
    if (activeId !== null && viewFor(context, activeId) === null) return reply(hiddenFailure('document'));
    if (entry.effect === 'edit' && activeId !== null) {
      if (lockedDocument(context, activeId)) return reply(lockedFailure());
      if (usePendingStore.getState().pending?.documentId === activeId) return fail(MCP_ERROR_CODE.DOCUMENT_BUSY, TOOL_TEXT.busy);
      const current = activeRevision();
      if (input.revision !== undefined && current !== null && input.revision !== current) {
        return reply(mcpFailure(ERROR_CODE.STALE_REVISION, TOOL_TEXT.stale(current), { currentRevision: current }));
      }
    }
  }
  return null;
};

const asContext = (args: Args): CommandContext => ({ point: { x: 0, y: 0 }, target: null, trigger: 'assistant', data: null, args });

const openForOwner = async (def: CommandDef, entry: ManifestEntry, args: Args): Promise<string> => {
  if (def.id === 'transform.rotate' && typeof args.angle === 'number') beginPending({ kind: 'rotate', angle: args.angle, bounds: args.bounds === 'expand' ? 'expand' : 'crop' }, true);
  else if (def.id === 'transform.scale' && typeof args.width === 'number' && typeof args.height === 'number') {
    beginPending({ kind: 'scale', width: args.width, height: args.height, bounds: args.bounds === 'expand' ? 'expand' : 'crop' }, true);
  } else await commands.run(def.id, asContext(args));
  return `dialog:${entry.dialog ?? def.id}`;
};

const runDirect = (id: string, args: Args): string | null => directOf(id)?.(args) ?? APP_TOOL_TEXT.failed(id);

const execute = async (def: CommandDef, entry: ManifestEntry, input: RunCommandInput, args: Args): Promise<ToolReply | string | null> => {
  if (entry.dialog !== null && input.show) return openForOwner(def, entry, args);
  const direct = directOf(def.id);
  if (entry.dialog !== null && direct === null) return fail(MCP_ERROR_CODE.COMMAND_ARGS, APP_TOOL_TEXT.dialog(def.id));
  if (direct !== null) {
    const problem = runDirect(def.id, args);
    return problem === null ? null : fail(MCP_ERROR_CODE.COMMAND_OFF, problem);
  }
  const result = await commands.run(def.id, asContext(args));
  if (result.ok) return null;
  return fail(MCP_ERROR_CODE.COMMAND_OFF, APP_TOOL_TEXT.off(def.id, result.reason || offReason()));
};

const runCommand: ToolHandler = async (raw, context) => {
  const input = raw as RunCommandInput;
  const def = commands.list().find((each) => each.id === input.id);
  if (!def) return fail(MCP_ERROR_CODE.COMMAND_UNKNOWN, APP_TOOL_TEXT.unknown(input.id), 'id');
  const entry = manifestOf(def.id);
  if (entry.refuse !== null) return fail(MCP_ERROR_CODE.COMMAND_REFUSED, entry.refuse);
  const blocked = guard(context, input, entry);
  if (blocked) return blocked;
  const parsed = parseArgs(def.id, entry, input.args);
  if ('failure' in parsed) return parsed.failure;
  const state = commands.describe(def.id);
  if (!state.enabled) return fail(MCP_ERROR_CODE.COMMAND_OFF, APP_TOOL_TEXT.off(def.id, state.reason ?? offReason()));
  const { displayName, sessionId } = context.call.session;
  const before = JSON.stringify(viewSnapshot());
  const outcome = await actAs({ actor: sessionId, label: (label) => TOOL_TEXT.labelOf(displayName, label) }, () => execute(def, entry, input, parsed.args));
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
