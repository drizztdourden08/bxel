/* @layer renderer-app @kind logic */
import { readPaletteFile } from '../palette-source/read-palette-file';
import { PASTED_NAME } from './source-from-text.constants';
import type { ImportSource } from './palette-import.type';

const sourceFromText = (text: string): ImportSource | null => {
  const read = readPaletteFile(new TextEncoder().encode(text), 'pasted.hex');
  return read.ok ? { name: PASTED_NAME, colors: read.palette.colors } : null;
};

export { sourceFromText };
