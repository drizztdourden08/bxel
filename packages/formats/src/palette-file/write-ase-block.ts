/* @layer core @kind logic */
import { ASE } from './ase.constants';

const writeAseBlock = (kind: number, body: Uint8Array): Uint8Array => {
  const out = new Uint8Array(ASE.BLOCK_HEAD_BYTES + body.length);
  const view = new DataView(out.buffer);
  view.setUint16(0, kind);
  view.setUint32(2, body.length);
  out.set(body, ASE.BLOCK_HEAD_BYTES);
  return out;
};

export { writeAseBlock };
