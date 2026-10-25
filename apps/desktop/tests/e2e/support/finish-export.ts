/* @layer renderer-app @kind logic */
import { readFile } from 'node:fs/promises';
import type { Locator } from 'playwright-core';
import { expect } from 'vitest';
import { POLL_MS } from './e2e.constants';

const finishExport = async (dialog: Locator, file: string): Promise<Uint8Array> => {
  await dialog.getByRole('button', { name: 'Browse...' }).click();
  await dialog.getByRole('button', { name: 'Export 1 file' }).click();
  await expect.poll(() => readFile(file).then((bytes) => bytes.length, () => 0), { timeout: POLL_MS }).toBeGreaterThan(0);
  await dialog.waitFor({ state: 'detached' });
  return new Uint8Array(await readFile(file));
};

export { finishExport };
