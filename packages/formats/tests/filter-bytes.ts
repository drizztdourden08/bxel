/* @layer tests @kind helper */
import { unzlibSync } from 'fflate';
import { listChunks } from './list-chunks';

const filterBytes = (png: Uint8Array, stride: number, height: number): number[] => {
  const idat = listChunks(png).find((chunk) => chunk.type === 'IDAT');
  const raw = unzlibSync(idat?.data ?? new Uint8Array(0));
  return Array.from({ length: height }, (_, row) => raw[row * (stride + 1)] ?? -1);
};

export { filterBytes };
