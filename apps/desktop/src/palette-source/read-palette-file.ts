/* @layer renderer-app @kind logic */
import { formatSwatchColor, MIN_ALPHA, parseSwatchColor, swatchFields } from '@bxel/document';
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
    const parsed = HEX_COLOR.test(entry.hex) ? parseSwatchColor(entry.hex) : null;
    if (parsed === null || parsed.alpha === MIN_ALPHA) continue;
    const text = formatSwatchColor(parsed.rgb, parsed.alpha);
    if (seen.has(text)) continue;
    seen.add(text);
    colors.push({ ...swatchFields(parsed.rgb, parsed.alpha), name: entry.name.trim() === '' ? text : entry.name.trim() });
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
