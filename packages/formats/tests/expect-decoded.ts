/* @layer tests @kind helper */
import { decodePng } from '@bxel/formats';
import { expect } from 'vitest';

const expectDecoded = (
  bytes: Uint8Array,
): { readonly width: number; readonly height: number; readonly data: number[] } => {
  const result = decodePng(bytes);
  if (!result.ok) throw new Error(`${result.code}: ${result.message}`);
  expect(result.data).toBeInstanceOf(Uint8ClampedArray);
  return { width: result.width, height: result.height, data: Array.from(result.data) };
};

export { expectDecoded };
