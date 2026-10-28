/* @layer renderer-app @kind hook */
import { findBank } from '@bxel/document';
import type { BankId } from '@bxel/document';
import { useMemo } from 'react';
import { spriteThumb } from '../../../asset-list/sprite-thumb';
import { paletteSlots } from '../../../editor/palette-slots';
import { useActiveAsset } from '../../../hooks/useActiveAsset';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { focusTab } from '../../../workspace/focus-tab';
import { tabOf } from '../../../workspace/tab-of';
import { PALETTE_CARD_TEXT } from '../PaletteCard.constants';
import type { PaletteCardModel } from '../PaletteCard.type';

const usePaletteCard = (): PaletteCardModel | null => {
  const view = useActiveDocument();
  const tab = useActiveAsset()?.tab;
  return useMemo(() => {
    if (!view || tab?.key.kind !== 'palette') return null;
    const { artwork, documentId } = view.state;
    const bank = findBank(artwork, tab.key.id as BankId);
    if (!bank) return null;
    const users = artwork.sprites
      .filter((sprite) => sprite.role === 'sprite' && sprite.bankId === bank.id)
      .map((sprite) => ({ id: sprite.id, name: sprite.name, thumb: spriteThumb(artwork, sprite), size: PALETTE_CARD_TEXT.size(sprite.width, sprite.height) }));
    return { bank, slots: paletteSlots(bank), users, open: (id: string) => focusTab(tabOf(documentId, { kind: 'sprite', id })) };
  }, [view, tab]);
};

export { usePaletteCard };
