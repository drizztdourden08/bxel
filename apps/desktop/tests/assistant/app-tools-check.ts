/* @layer renderer-app @kind test */
import { buildTools } from '@bxel/mcp';
import type { Grant, ToolName, ToolOutcome } from '@bxel/mcp';
import { documentCommands } from '@bxel/document';
import { call, contextWith } from './app-tools-rig';

const tools = buildTools(documentCommands);

const valid = (tool: string, outcome: ToolOutcome): ToolOutcome => {
  const checked = tools.find((candidate) => candidate.name === tool)?.output.safeParse(outcome);
  if (checked?.success !== true) throw new Error(`${tool} answered a shape the contract refuses: ${JSON.stringify(checked?.error.issues)}`);
  return outcome;
};

const parsed = (tool: ToolName, input: unknown): unknown => tools.find((candidate) => candidate.name === tool)?.input.parse(input);

const ok = async (tool: ToolName, input: unknown, grant?: Grant): Promise<Record<string, unknown>> => {
  const outcome = valid(tool, await call(tool, parsed(tool, input), contextWith(grant)));
  if (!outcome.ok) throw new Error(`${tool} failed: ${outcome.error.message}`);
  return outcome;
};

const code = async (tool: ToolName, input: unknown, grant?: Grant): Promise<string> => {
  const outcome = await call(tool, parsed(tool, input), contextWith(grant));
  return outcome.ok ? 'OK' : outcome.error.code;
};

const check = { ok, code, valid };

export { check };
