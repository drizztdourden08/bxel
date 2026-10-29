/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { assetKeys } from '../../workspace/asset-keys';
import { keyId } from '../../workspace/key-id';
import type { ToolContext } from '../assistant.type';

const assetIdsIn = (context: ToolContext, documentId: DocumentId): ReadonlySet<string> => {
  const artwork = context.host.view(documentId)?.state.artwork;
  return new Set((artwork ? assetKeys(artwork) : []).map(keyId));
};

export { assetIdsIn };
