/* @layer renderer-app @kind types */
interface PaletteSlot {
  index: number;
  hex: string;
  name: string;
  transparent: boolean;
  alpha: number;
  label: string;
}

export type { PaletteSlot };
