/* @layer core @kind logic */
import type { AseName } from './read-ase-name.type';

const readAseName = (view: DataView, at: number): AseName | undefined => {
  if (at + 2 > view.byteLength) return undefined;
  const length = view.getUint16(at);
  const end = at + 2 + length * 2;
  if (end > view.byteLength) return undefined;
  let name = '';
  for (let i = 0; i < length; i += 1) {
    const unit = view.getUint16(at + 2 + i * 2);
    if (unit !== 0) name += String.fromCharCode(unit);
  }
  return { name, next: end };
};

export { readAseName };
