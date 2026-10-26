/* @layer renderer-app @kind logic */
import { readFile } from 'node:fs/promises';
import type { Locator } from 'playwright-core';
import { EXPORT_DONE_MS } from './e2e.constants';

const finishExport = async (dialog: Locator, file: string): Promise<Uint8Array> => {
  await dialog.getByRole('button', { name: 'Browse...' }).click();
  await dialog.getByRole('button', { name: 'Export 1 file' }).click();
  await dialog.waitFor({ state: 'detached' });
  await dialog.page().getByText(/^Exported 1 file to /).waitFor({ timeout: EXPORT_DONE_MS });
  return new Uint8Array(await readFile(file));
};

export { finishExport };
