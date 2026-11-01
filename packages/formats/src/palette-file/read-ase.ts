/* @layer core @kind logic */
import { ASE } from './ase.constants';
import { finishPalette } from './finish-palette';
import type { PaletteColor, PaletteReadResult } from './palette-file.type';
import { paletteInvalid } from './palette-invalid';
import { readAseColor } from './read-ase-color';
import { readAseName } from './read-ase-name';

const hasMagic = (bytes: Uint8Array): boolean =>
  bytes.length >= ASE.HEADER_BYTES && String.fromCharCode(...bytes.subarray(0, ASE.MAGIC.length)) === ASE.MAGIC;

const applyBlock = (view: DataView, kind: number, body: number, found: { name: string; colors: PaletteColor[] }): void => {
  if (kind === ASE.BLOCK_GROUP_START && found.name === '') found.name = readAseName(view, body)?.name ?? '';
  if (kind !== ASE.BLOCK_COLOR) return;
  const color = readAseColor(view, body);
  if (color) found.colors.push(color);
};

const readAse = (bytes: Uint8Array): PaletteReadResult => {
  if (!hasMagic(bytes)) return paletteInvalid('Not an Adobe Swatch Exchange file');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const blocks = view.getUint32(ASE.HEADER_BYTES - 4);
  let at = ASE.HEADER_BYTES;
  const found: { name: string; colors: PaletteColor[] } = { name: '', colors: [] };
  for (let i = 0; i < blocks; i += 1) {
    if (at + ASE.BLOCK_HEAD_BYTES > view.byteLength) return paletteInvalid('The file ends inside a block');
    const kind = view.getUint16(at);
    const length = view.getUint32(at + 2);
    const body = at + ASE.BLOCK_HEAD_BYTES;
    if (body + length > view.byteLength) return paletteInvalid('The file ends inside a block');
    applyBlock(view, kind, body, found);
    at = body + length;
  }
  return finishPalette(found.name, found.colors);
};

export { readAse };
