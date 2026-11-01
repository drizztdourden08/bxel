/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';
import type { PaletteTarget } from '../editor/editor.type';
import { useDocumentStore } from '../stores/useDocumentStore';

const currentBank = (target: PaletteTarget): PaletteBank | null => {
  const artwork = useDocumentStore.getState().host.view(target.documentId)?.state.artwork;
  return artwork ? (findBank(artwork, target.bank.id) ?? null) : null;
};

export { currentBank };
