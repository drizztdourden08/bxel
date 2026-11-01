/* @layer renderer-app @kind logic */
import type { BankId } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import type { PaletteTarget } from '../editor/editor.type';
import { useDocumentStore } from '../stores/useDocumentStore';
import { currentTab } from '../workspace/current-tab';
import { paletteFileTarget } from './palette-file-target';

/** The palette the panel works on: the bank of the open palette file, else the bank of the sprite being edited. */
const currentPaletteTarget = (): PaletteTarget | null => {
  const tab = currentTab();
  if (tab?.key.kind !== 'palette') return currentTarget();
  const view = useDocumentStore.getState().host.view(tab.documentId);
  return view ? paletteFileTarget(view, tab.key.id as BankId) : null;
};

export { currentPaletteTarget };
