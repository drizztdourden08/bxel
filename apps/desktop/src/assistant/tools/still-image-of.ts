/* @layer renderer-app @kind logic */
import { decodePng } from '@bxel/formats';
import type { RgbaImage } from '@bxel/formats';
import { decodeBase64 } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';

const stillImageOf = ({ outcome, images }: ToolReply): RgbaImage | null => {
  const first = images[0];
  if (!outcome.ok || first === undefined || (outcome.mimeType !== undefined && outcome.mimeType !== 'image/png')) return null;
  const bytes = decodeBase64(first);
  const decoded = bytes ? decodePng(bytes) : null;
  return decoded?.ok ? { data: decoded.data, width: decoded.width, height: decoded.height } : null;
};

export { stillImageOf };
