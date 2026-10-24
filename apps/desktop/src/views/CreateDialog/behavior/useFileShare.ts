/* @layer renderer-app @kind hook */
import { findBank } from '@bxel/document';
import { useMemo } from 'react';
import { PALETTE_TEXT } from '../../../editor/palette-text.constants';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import type { FileShare } from '../CreateDialog.type';

const useFileShare = (): FileShare | null => {
  const view = useActiveDocument();
  return useMemo(() => {
    if (!view) return null;
    const { artwork } = view.state;
    const bank = findBank(artwork, artwork.defaultBankId);
    if (!bank) return null;
    const sprites = artwork.sprites.filter((sprite) => sprite.bankId === bank.id).length;
    return { name: bank.name, sprites, count: PALETTE_TEXT.count(bank.cap, bank.transparent) };
  }, [view]);
};

export { useFileShare };
