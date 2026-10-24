/* @layer tests @kind helper */
import type { FormatBytesResult } from '@bxel/formats';
import { expect } from 'vitest';

const expectSameBytes = (first: FormatBytesResult, second: FormatBytesResult): void => {
  if (!first.ok || !second.ok) throw new Error('Both encodes must succeed');
  expect(Array.from(second.bytes)).toEqual(Array.from(first.bytes));
};

export { expectSameBytes };
