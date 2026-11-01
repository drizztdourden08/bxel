/* @layer renderer-app @kind logic */
import { readPaletteFile } from '../palette-source/read-palette-file';
import type { ImportSource } from './palette-import.type';

const PASTED_NAME = 'Pasted colours';

/** Reads a pasted list of hex colours, one per line, the way a .hex file is read. */
const sourceFromText = (text: string): ImportSource | null => {
  const read = readPaletteFile(new TextEncoder().encode(text), 'pasted.hex');
  return read.ok ? { name: PASTED_NAME, colors: read.palette.colors } : null;
};

export { sourceFromText };
