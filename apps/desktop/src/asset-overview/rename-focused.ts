/* @layer renderer-app @kind logic */
import type { AssetFocus } from '../asset-config/asset-config.type';
import { useDocumentStore } from '../stores/useDocumentStore';
import { renameAsset } from '../workspace/rename-asset';
import { OVERVIEW_TEXT } from './asset-overview.constants';

const renameFocused = (focus: AssetFocus, name: string): string | null => {
  const typed = name.trim();
  if (typed === '') return OVERVIEW_TEXT.nameEmpty;
  if (focus.readOnly) return OVERVIEW_TEXT.readOnly;
  return renameAsset(useDocumentStore.getState().host, focus.documentId, focus.key, typed) ? null : OVERVIEW_TEXT.renameFailed;
};

export { renameFocused };
