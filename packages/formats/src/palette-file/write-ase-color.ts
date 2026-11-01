/* @layer core @kind logic */
import { ASE } from './ase.constants';
import { writeAseBlock } from './write-ase-block';
import { COLOR_TAIL } from './write-ase-color.constants';
import { writeAseName } from './write-ase-name';

const writeAseColor = (name: string, rgba: readonly number[]): Uint8Array => {
  const label = writeAseName(name);
  const body = new Uint8Array(label.length + COLOR_TAIL);
  body.set(label, 0);
  const view = new DataView(body.buffer);
  for (let i = 0; i < ASE.MODEL_BYTES; i += 1) view.setUint8(label.length + i, ASE.MODEL_RGB.charCodeAt(i));
  for (let i = 0; i < 3; i += 1) {
    view.setFloat32(label.length + ASE.MODEL_BYTES + i * 4, (rgba[i] ?? 0) / ASE.CHANNEL_MAX);
  }
  view.setUint16(label.length + COLOR_TAIL - 2, ASE.COLOR_TYPE_NORMAL);
  return writeAseBlock(ASE.BLOCK_COLOR, body);
};

export { writeAseColor };
