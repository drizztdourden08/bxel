/* @layer renderer-app @kind logic */
import { formatSwatchColor, MIN_ALPHA, parseSwatchColor, swatchFields } from '@bxel/document';
import { readAse, readGpl, readHex, readJascPal, readPaintNet, readPalettePng } from '@bxel/formats';
import type { PaletteFile, PaletteReadResult } from '@bxel/formats';
import { baseName } from '../files/base-name';
import { fileExtension } from '../files/file-extension';
import { HEX_COLOR, PALETTE_FILE_KIND, SOURCE_TEXT } from './palette-source.constants';
import type { LoadedPalette, PaletteRead, SourceColor } from './palette-source.type';

const TEXT_READERS: Readonly<Record<string, (text: string) => PaletteReadResult>> = {
  [PALETTE_FILE_KIND.gpl]: readGpl,
  [PALETTE_FILE_KIND.pal]: readJascPal,
  [PALETTE_FILE_KIND.hex]: readHex,
  [PALETTE_FILE_KIND.txt]: readPaintNet,
};

const parseBytes = (bytes: Uint8Array, extension: string): PaletteReadResult | null => {
  if (extension === PALETTE_FILE_KIND.png) return readPalettePng(bytes);
  if (extension === PALETTE_FILE_KIND.ase) return readAse(bytes);
  const reader = TEXT_READERS[extension];
  return reader ? reader(new TextDecoder().decode(bytes)) : null;
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
