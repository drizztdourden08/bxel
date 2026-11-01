/* @layer renderer-app @kind logic */
import { decodeBase64 } from '@bxel/mcp';
import { diskThumb } from '../../asset-thumbs/disk-thumb';
import type { ToolContext } from '../assistant.type';

type ThumbKind = Parameters<typeof diskThumb>[1]['kind'];

const fileThumbBytes = async (context: ToolContext, path: string, kind: ThumbKind): Promise<{ readonly bytes: Uint8Array; readonly gif: boolean } | null> => {
  const url = await diskThumb(context.documents, { key: path, kind, assetId: null, path, modified: 0, size: 0, loaded: false });
  const encoded = url?.split(',')[1];
  const bytes = encoded === undefined ? null : decodeBase64(encoded);
  return bytes === null ? null : { bytes, gif: url?.startsWith('data:image/gif') === true };
};

export { fileThumbBytes };
