/* @layer renderer-app @kind types */
interface PaletteSlot {
  index: number;
  hex: string;
  name: string;
  transparent: boolean;
  label: string;
}

export type { PaletteSlot };
