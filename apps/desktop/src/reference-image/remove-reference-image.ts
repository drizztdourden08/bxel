/* @layer renderer-app @kind logic */
import { useAssetViewStore } from '../stores/useAssetViewStore';
import { currentReferences } from './current-references';
import { currentViewKey } from './current-view-key';

const removeReferenceImage = (id: string): boolean => {
  const key = currentViewKey();
  const list = currentReferences();
  if (key === null || !list.some((each) => each.id === id)) return false;
  useAssetViewStore.getState().patch(key, { references: list.filter((each) => each.id !== id) });
  return true;
};

export { removeReferenceImage };
