/* @layer renderer-app @kind component */
import { ColorSwatch } from '@drizztdourden08/tessera';
import { toast, writeClipboard } from '@drizztdourden08/brock-react';
import { PALETTE_TEXT } from '../../../editor/palette-text.constants';
import type { PaletteSlot } from '../../../editor/palette-slots.type';

const copyHex = async (slot: PaletteSlot): Promise<void> => {
  if (slot.transparent) return;
  const copied = await writeClipboard(slot.hex);
  toast(copied ? PALETTE_TEXT.hexCopied(slot.hex) : PALETTE_TEXT.hexFailed, { variant: copied ? 'success' : 'danger' });
};

const SwatchTile = ({ slot }: { readonly slot: PaletteSlot }) => (
  <ColorSwatch
    color={slot.hex}
    transparent={slot.transparent}
    caption={slot.index}
    aria-label={slot.label}
    title={slot.label}
    onClick={() => void copyHex(slot)}
  />
);

export { SwatchTile };
