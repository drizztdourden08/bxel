/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';
import { useDocumentStore } from '../stores/useDocumentStore';

const currentBank = (target: EditorTarget): PaletteBank | null => {
  const artwork = useDocumentStore.getState().host.view(target.documentId)?.state.artwork;
  return artwork ? (findBank(artwork, target.bank.id) ?? null) : null;
};

export { currentBank };
