/* @layer renderer-app @kind logic */
import { PALETTE_DROP_EXTENSIONS } from './palette-import.constants';

const droppedPaletteFile = (files: readonly File[]): File | null =>
  files.find((file) => PALETTE_DROP_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension))) ?? null;

export { droppedPaletteFile };
