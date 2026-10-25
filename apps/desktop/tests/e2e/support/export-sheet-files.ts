/* @layer renderer-app @kind logic */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { decodePng } from '@bxel/formats';
import { expect } from 'vitest';
import { POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';
import { openExportDialog } from './open-export-dialog';
import type { SheetFiles } from './sheet-files.type';

const exportSheetFiles = async (session: Session, folder: string, name: string, columns: number): Promise<SheetFiles> => {
  const dialog = await openExportDialog(session, { open: null, save: null });
  await dialog.getByRole('radio', { name: 'Sheet and JSON' }).check();
  await dialog.getByRole('radio', { name: /^All sprites/ }).check();
  await dialog.getByRole('spinbutton', { name: 'Columns' }).fill(String(columns));
  await dialog.getByRole('button', { name: 'Export 2 files' }).click();
  const json = join(folder, `${name}.json`);
  await expect.poll(() => readFile(json).then((bytes) => bytes.length, () => 0), { timeout: POLL_MS }).toBeGreaterThan(0);
  await dialog.waitFor({ state: 'detached' });
  const decoded = decodePng(new Uint8Array(await readFile(join(folder, `${name}.png`))));
  if (!decoded.ok) throw new Error(decoded.message);
  return { image: decoded, json: JSON.parse(await readFile(json, 'utf8')) as Record<string, unknown> };
};

export { exportSheetFiles };
