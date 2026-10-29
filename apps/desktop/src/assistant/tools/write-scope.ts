/* @layer renderer-app @kind logic */
import type { McpResult } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import type { FilePlace } from './project-files-input.type';
import { resolveEntries } from './resolve-entries';
import { visibleProject } from './visible-project';
import type { WriteScope } from './write-scope.type';

const writeScope = async (context: ToolContext, projectId: string, files: readonly FilePlace[], field: string): Promise<McpResult<WriteScope>> => {
  const scope = visibleProject(context, projectId, true);
  if (!scope.ok) return scope;
  const entries = await resolveEntries(context, scope.value.visible, files, field);
  return entries.ok ? { ok: true, value: { visible: scope.value.visible, entries: entries.value } } : entries;
};

export { writeScope };
