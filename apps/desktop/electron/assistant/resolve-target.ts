/* @layer electron-main @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult, ToolRouteName } from '@bxel/mcp';
import { checkFileName } from '@bxel/project';
import type { FileKind } from '@bxel/project';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { fieldOf } from '../../src/assistant-bridge/field-of';
import { saveKindOf } from '../../src/assistant-bridge/save-kind-of';
import type { TargetCall, WantedFile } from './assistant.type';

const exportKindOf = (input: unknown): FileKind => (fieldOf(input, 'format') === 'gif' ? 'gif' : 'png');

const wantedFile = (tool: ToolRouteName, input: unknown): WantedFile | null => {
  const holder = tool === 'save_document' ? fieldOf(input, 'target') : input;
  const name = fieldOf(holder, 'fileName');
  if (typeof name !== 'string' || (tool !== 'save_document' && tool !== 'export_document')) return null;
  const kind: FileKind = tool === 'save_document' ? saveKindOf(name) : exportKindOf(input);
  return { name, kind, overwrite: fieldOf(holder, 'overwrite') === true, path: tool === 'save_document' ? 'target.fileName' : 'fileName' };
};

const resolveTarget = async (ctx: MainContext, folder: string, call: TargetCall): Promise<McpResult<string | null>> => {
  const wanted = wantedFile(call.tool, call.input);
  if (!wanted) return { ok: true, value: null };
  const checked = checkFileName(wanted.name, wanted.kind);
  if (!checked.ok) return mcpFailure(checked.code, checked.message, { path: wanted.path });
  await mkdir(folder, { recursive: true });
  const path = join(folder, wanted.name);
  if (!wanted.overwrite && existsSync(path)) {
    return mcpFailure(MCP_ERROR_CODE.FILE_EXISTS, `${wanted.name} exists. Pass overwrite: true to replace it.`, { path: wanted.path });
  }
  ctx.documents.allow(path);
  return { ok: true, value: path };
};

export { resolveTarget };
