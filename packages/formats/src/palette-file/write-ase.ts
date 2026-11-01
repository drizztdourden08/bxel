/* @layer core @kind logic */
import { concatBytes } from '../concat-bytes';
import { isFormatFailure } from '../failure/is-format-failure';
import type { FormatBytesResult } from '../failure/format.type';
import { ASE } from './ase.constants';
import { cleanPaletteName } from './clean-palette-name';
import type { PaletteFile } from './palette-file.type';
import { parsePaletteColors } from './parse-palette-colors';
import { writeAseBlock } from './write-ase-block';
import { writeAseColor } from './write-ase-color';
import { writeAseName } from './write-ase-name';

const header = (blocks: number): Uint8Array => {
  const out = new Uint8Array(ASE.HEADER_BYTES);
  const view = new DataView(out.buffer);
  for (let i = 0; i < ASE.MAGIC.length; i += 1) view.setUint8(i, ASE.MAGIC.charCodeAt(i));
  view.setUint16(4, ASE.VERSION_MAJOR);
  view.setUint16(6, ASE.VERSION_MINOR);
  view.setUint32(8, blocks);
  return out;
};

const writeAse = (palette: PaletteFile): FormatBytesResult => {
  const parsed = parsePaletteColors(palette);
  if (isFormatFailure(parsed)) return parsed;
  const name = cleanPaletteName(palette.name);
  const colors = parsed.map((rgba, i) => writeAseColor(cleanPaletteName(palette.colors[i]?.name ?? ''), rgba));
  const grouped = name === '';
  const inner = grouped
    ? colors
    : [writeAseBlock(ASE.BLOCK_GROUP_START, writeAseName(name)), ...colors, writeAseBlock(ASE.BLOCK_GROUP_END, new Uint8Array(0))];
  return { ok: true, bytes: concatBytes([header(inner.length), ...inner]) };
};

export { writeAse };
