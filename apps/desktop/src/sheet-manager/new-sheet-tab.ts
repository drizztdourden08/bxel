/* @layer renderer-app @kind logic */
import type { AssetKey } from '@bxel/document';
import { openCreatedAsset } from '../new-sprite/open-created-asset';
import { useDocumentStore } from '../stores/useDocumentStore';
import { createSheet } from './create-sheet';

const newSheetTab = async (): Promise<boolean> => {
  const documentId = useDocumentStore.getState().activeId;
  const id = documentId === null ? null : createSheet();
  if (documentId === null || id === null) return false;
  const key: AssetKey = { kind: 'sheet', id };
  await openCreatedAsset(documentId, key);
  return true;
};

export { newSheetTab };
