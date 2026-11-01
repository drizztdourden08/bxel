/* @layer renderer-app @kind logic */
import { encodeBase64, MCP_ERROR_CODE, mcpFailure, RENDER_PNG_BYTES_MAX } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import { kindOfName } from '../../panel-browser/kind-of-name';
import type { ToolContext } from '../assistant.type';
import { fileThumbBytes } from './file-thumb-bytes';
import { indexHash } from './index-hash';
import { projectFolder } from './project-folder';
import { projectPath } from './project-path';
import { GIF_WIDTH_AT, PNG_WIDTH_AT } from './render-file-preview.constants';
import { reply } from './reply';
import type { FileRenderInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const dimensionsOf = (bytes: Uint8Array, gif: boolean): { readonly width: number; readonly height: number } => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.length <= PNG_WIDTH_AT + 8) return { width: 0, height: 0 };
  return gif ? { width: view.getUint16(GIF_WIDTH_AT, true), height: view.getUint16(GIF_WIDTH_AT + 2, true) } : { width: view.getUint32(PNG_WIDTH_AT), height: view.getUint32(PNG_WIDTH_AT + 4) };
};

const renderFilePreview = async (context: ToolContext, request: FileRenderInput): Promise<ToolReply> => {
  const { file } = request;
  const folder = projectFolder(context, file.projectId, file.folderId);
  if (!folder.ok) return reply(folder);
  const path = projectPath(folder.value.folder.path, file.path);
  if (!path.ok) return reply(path);
  const kind = kindOfName(fileName(path.value));
  if (kind === 'folder' || kind === 'group' || kind === 'other' || kind === 'project') {
    return reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, TOOL_TEXT.noFilePreview, { path: 'file.path' }));
  }
  const thumb = await fileThumbBytes(context, path.value, kind);
  if (thumb === null) return reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, TOOL_TEXT.noFilePreview, { path: 'file.path' }));
  const { bytes, gif } = thumb;
  if (bytes.length > RENDER_PNG_BYTES_MAX) return reply(mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.pngTooLarge));
  return reply(
    {
      ok: true,
      revision: 0,
      ...dimensionsOf(bytes, gif),
      scale: 1,
      indexHash: await indexHash(bytes),
      uri: `bxel://file/${file.projectId}/${file.folderId}/${file.path}/preview.png`,
      ...(gif ? { mimeType: 'image/gif' as const } : {}),
    },
    [encodeBase64(bytes)],
  );
};

export { renderFilePreview };
