/* @layer renderer-app @kind test */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect } from 'vitest';

const GOLDEN = join(dirname(fileURLToPath(import.meta.url)), 'golden');

const expectGolden = (name: string, actual: string | Uint8Array): void => {
  const path = join(GOLDEN, name);
  if (process.env['UPDATE_GOLDEN'] === '1' || !existsSync(path)) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, actual);
    return;
  }
  const expected = readFileSync(path);
  if (typeof actual === 'string') expect(actual).toBe(expected.toString('utf8'));
  else expect(Array.from(actual)).toEqual(Array.from(expected));
};

export { expectGolden };
