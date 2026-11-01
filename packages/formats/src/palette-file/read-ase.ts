/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { ASE } from './ase.constants';
import type { PaletteColor, PaletteReadResult } from './palette-file.type';
import { paletteInvalid } from './palette-invalid';
import { PALETTE_LIMITS } from './palette-limits.constants';
import { readAseColor } from './read-ase-color';
import { readAseName } from './read-ase-name';

const hasMagic = (bytes: Uint8Array): boolean =>
  bytes.length >= ASE.HEADER_BYTES && String.fromCharCode(...bytes.subarray(0, ASE.MAGIC.length)) === ASE.MAGIC;

const readAse = (bytes: Uint8Array): PaletteReadResult => {
  if (!hasMagic(bytes)) return paletteInvalid('Not an Adobe Swatch Exchange file');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const blocks = view.getUint32(ASE.HEADER_BYTES - 4);
  let at = ASE.HEADER_BYTES;
  let name = '';
  const colors: PaletteColor[] = [];
  for (let i = 0; i < blocks; i += 1) {
    if (at + ASE.BLOCK_HEAD_BYTES > view.byteLength) return paletteInvalid('The file ends inside a block');
    const kind = view.getUint16(at);
    const length = view.getUint32(at + 2);
    const body = at + ASE.BLOCK_HEAD_BYTES;
    if (body + length > view.byteLength) return paletteInvalid('The file ends inside a block');
    if (kind === ASE.BLOCK_GROUP_START && name === '') name = readAseName(view, body)?.name ?? '';
    if (kind === ASE.BLOCK_COLOR) {
      const color = readAseColor(view, body);
      if (color) colors.push(color);
    }
    at = body + length;
  }
  if (colors.length === 0) return paletteInvalid('The file holds no colours');
  if (colors.length > PALETTE_LIMITS.MAX_COLORS) {
    return formatFail(FORMAT_ERROR_CODE.PALETTE_TOO_LARGE, `The palette holds more than ${PALETTE_LIMITS.MAX_COLORS} colours`);
  }
  return { ok: true, palette: { name, colors } };
};

export { readAse };
