/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import type { Failure } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { checkMoveAccess } from './check-move-access';
import { checkPathFree } from './check-path-free';

const checkAssetSave = (context: ToolContext, documentId: DocumentId, key: AssetKey, place: { readonly path: string; readonly moving: boolean }): Failure | null =>
  checkPathFree(context, place.path, { documentId, id: key.id }) ?? checkMoveAccess(context, documentId, key, place.moving);

export { checkAssetSave };
