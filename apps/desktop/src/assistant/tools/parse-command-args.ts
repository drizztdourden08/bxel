/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { ARGS_KINDS } from '../command-manifest/args-schemas.constants';
import type { ManifestEntry } from '../command-manifest/manifest.type';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { commandFail } from './command-fail';
import type { Parsed } from './parse-command-args.type';
import type { Args } from './run-command.type';

const issueFailure = (id: string, issue: { readonly path: readonly PropertyKey[]; readonly message: string } | undefined): ToolReply => {
  const where = (issue?.path ?? []).map(String).join('.');
  const path = where === '' ? 'args' : `args.${where}`;
  return commandFail(MCP_ERROR_CODE.COMMAND_ARGS, APP_TOOL_TEXT.needsArgs(id, `${path}: ${issue?.message ?? 'not valid.'}`), path);
};

const parseCommandArgs = (id: string, entry: ManifestEntry, given: Args | undefined): Parsed => {
  if (entry.args === null) {
    const extra = given !== undefined && Object.keys(given).length > 0;
    return extra ? { failure: commandFail(MCP_ERROR_CODE.COMMAND_ARGS, APP_TOOL_TEXT.noArgs(id), 'args') } : { args: {} };
  }
  const parsed = ARGS_KINDS[entry.args].safeParse(given ?? {});
  if (parsed.success) return { args: parsed.data };
  return { failure: issueFailure(id, parsed.error.issues[0]) };
};

export { parseCommandArgs };
