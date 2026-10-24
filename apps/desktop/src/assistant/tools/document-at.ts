/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { findAssetTab } from '../../workspace/find-asset-tab';
import type { ToolContext } from '../assistant.type';

const documentAt = (context: ToolContext, path: string): DocumentId | null =>
  findAssetTab(path)?.documentId ?? context.paths.documentAt(path) ?? null;

export { documentAt };
