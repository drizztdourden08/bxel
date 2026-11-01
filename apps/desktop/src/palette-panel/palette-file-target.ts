/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import type { PaletteTarget } from '../editor/editor.type';

const paletteFileTarget = (view: DocumentView, bankId: BankId): PaletteTarget | null => {
  const { documentId, revision, artwork } = view.state;
  const bank = findBank(artwork, bankId);
  return bank ? { documentId, revision, bank, sprite: null } : null;
};

export { paletteFileTarget };
