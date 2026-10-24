/* @layer core @kind logic */
import { ERROR_CODE } from '@bxel/document';
import type { McpResult } from '../errors/error.type';
import { mcpFailure } from '../errors/mcp-failure';
import { decodeBase64 } from './decode-base64';

const decodePixelBlock = (
  text: string,
  size: { readonly width: number; readonly height: number },
  path: string,
): McpResult<Uint8Array> => {
  const bytes = decodeBase64(text);
  if (bytes === null) {
    return mcpFailure(ERROR_CODE.INVALID_OPTION, `${path}: the pixels are not standard base64 with padding.`, { path });
  }
  const expected = size.width * size.height;
  if (bytes.length !== expected) {
    return mcpFailure(ERROR_CODE.INVALID_OPTION, `${path}: expected ${expected} bytes, got ${bytes.length}.`, { path });
  }
  return { ok: true, value: bytes };
};

export { decodePixelBlock };
