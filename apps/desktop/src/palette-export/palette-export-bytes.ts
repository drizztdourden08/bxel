/* @layer renderer-app @kind logic */
import { decodePng, encodePngRgba, upscaleRgba, writeAse, writeGpl, writeHex, writeJascPal, writePaintNet, writePalettePng } from '@bxel/formats';
import type { PaletteFile, PaletteTextResult } from '@bxel/formats';
import type { PaletteExportBytes, PaletteExportFormat } from './palette-export.type';

const TEXT_WRITERS: Readonly<Record<string, (palette: PaletteFile) => PaletteTextResult>> = {
  gpl: writeGpl,
  pal: writeJascPal,
  hex: writeHex,
  txt: writePaintNet,
};

const pngBytes = (file: PaletteFile, scale: number): PaletteExportBytes => {
  const strip = writePalettePng(file, 'row');
  if (!strip.ok || scale === 1) return strip.ok ? strip : { ok: false, message: strip.message };
  const decoded = decodePng(strip.bytes);
  if (!decoded.ok) return { ok: false, message: decoded.message };
  const encoded = encodePngRgba(upscaleRgba({ data: decoded.data, width: decoded.width, height: decoded.height }, scale));
  return encoded.ok ? encoded : { ok: false, message: encoded.message };
};

const textBytes = (written: PaletteTextResult): PaletteExportBytes =>
  written.ok ? { ok: true, bytes: new TextEncoder().encode(written.text) } : { ok: false, message: written.message };

const paletteExportBytes = (file: PaletteFile, format: PaletteExportFormat): PaletteExportBytes => {
  if (format.extension === 'png') return pngBytes(file, format.scale);
  if (format.extension === 'ase') {
    const written = writeAse(file);
    return written.ok ? written : { ok: false, message: written.message };
  }
  const writer = TEXT_WRITERS[format.extension];
  return writer ? textBytes(writer(file)) : { ok: false, message: format.extension };
};

export { paletteExportBytes };
