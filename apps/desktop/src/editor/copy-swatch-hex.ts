/* @layer renderer-app @kind logic */
import { toast, writeClipboard } from '@drizztdourden08/brock-react';
import type { SwatchArgs } from '../context-menu/menu-args.type';
import { currentTarget } from './current-target';
import { paletteSlots } from './palette-slots';
import { PALETTE_TEXT } from './palette-text.constants';
import { swatchRef } from './swatch-ref';

const copySwatchHex = async (args: Partial<SwatchArgs>): Promise<void> => {
  const target = currentTarget();
  const index = swatchRef(args);
  const slot = target && index !== null ? paletteSlots(target.bank)[index] : undefined;
  if (!slot || slot.transparent) return;
  const copied = await writeClipboard(slot.hex);
  toast(copied ? PALETTE_TEXT.hexCopied(slot.hex) : PALETTE_TEXT.hexFailed, { variant: copied ? 'success' : 'danger' });
};

export { copySwatchHex };
