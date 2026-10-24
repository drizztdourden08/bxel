/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import { entryKindOf } from '@bxel/project';
import { fileName } from '../../files/file-name';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { assetKeys } from '../../workspace/asset-keys';
import type { ToolContext } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import type { AssetInput } from './tool-input.type';

const assetFor = (context: ToolContext, documentId: DocumentId, path: string, wanted?: AssetInput): AssetKey | null => {
  const kind = entryKindOf(fileName(path));
  const artwork = context.host.view(documentId)?.state.artwork;
  const hidden = hiddenAssets(context, documentId);
  const keys = artwork ? assetKeys(artwork).filter((key) => key.kind === kind && !hidden.has(key.id)) : [];
  if (wanted) return keys.find((key) => key.id === wanted.id) ?? null;
  const { tabs, activeTab } = useWorkspaceStore.getState();
  const active = tabs.find((tab) => tab.id === activeTab && tab.documentId === documentId)?.key;
  return keys.find((key) => key.id === active?.id) ?? keys[0] ?? null;
};

export { assetFor };
