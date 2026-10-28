/* @layer renderer-app @kind types */
import type { PaletteBank } from '@bxel/document';
import type { PaletteSlot } from '../../editor/palette-slots.type';

interface PaletteUser {
  id: string;
  name: string;
  thumb: string | null;
  size: string;
}

interface PaletteCardModel {
  bank: PaletteBank;
  slots: readonly PaletteSlot[];
  users: readonly PaletteUser[];
  open: (spriteId: string) => void;
}

export type { PaletteCardModel, PaletteUser };
