/* @layer renderer-app @kind logic */
import { readGpl, readJascPal, readPalettePng } from '@bxel/formats';
import type { PaletteFile, PaletteReadResult } from '@bxel/formats';
import { baseName } from '../files/base-name';
import { fileExtension } from '../files/file-extension';
import { HEX_COLOR, PALETTE_FILE_KIND, SOURCE_TEXT } from './palette-source.constants';
import type { LoadedPalette, PaletteRead, SourceColor } from './palette-source.type';

const parseBytes = (bytes: Uint8Array, extension: string): PaletteReadResult | null => {
  if (extension === PALETTE_FILE_KIND.png) return readPalettePng(bytes);
  if (extension !== PALETTE_FILE_KIND.gpl && extension !== PALETTE_FILE_KIND.pal) return null;
  const text = new TextDecoder().decode(bytes);
  return extension === PALETTE_FILE_KIND.gpl ? readGpl(text) : readJascPal(text);
};

const distinctColors = (file: PaletteFile): SourceColor[] => {
  const seen = new Set<string>();
  const colors: SourceColor[] = [];
  for (const entry of file.colors) {
    if (!HEX_COLOR.test(entry.hex) || entry.hex.slice(7) === '00') continue;
    const rgb = entry.hex.slice(0, 7).toLowerCase();
    if (seen.has(rgb)) continue;
    seen.add(rgb);
    colors.push({ rgb, name: entry.name.trim() === '' ? rgb : entry.name.trim() });
  }
  return colors;
};

const readPaletteFile = (bytes: Uint8Array, fileName: string): PaletteRead => {
  const parsed = parseBytes(bytes, fileExtension(fileName));
  if (!parsed?.ok) return { ok: false, message: SOURCE_TEXT.unreadable };
  const colors = distinctColors(parsed.palette);
  if (colors.length === 0) return { ok: false, message: SOURCE_TEXT.unreadable };
  const palette: LoadedPalette = { fileName, name: parsed.palette.name.trim() || baseName(fileName), colors };
  return { ok: true, palette };
};

export { readPaletteFile };
