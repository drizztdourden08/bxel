/* @layer renderer-app @kind logic */
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { expect } from 'vitest';
import { POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';
import { openExportDialog } from './open-export-dialog';

const exportAnimation = async (session: Session, format: 'GIF' | 'APNG'): Promise<Uint8Array> => {
  const folder = join(session.dir, `out-${format}`);
  const file = join(folder, `walk.${format === 'GIF' ? 'gif' : 'png'}`);
  await mkdir(folder, { recursive: true });
  const dialog = await openExportDialog(session, { open: null, save: file });
  await dialog.getByRole('radio', { name: 'Animation' }).check();
  await dialog.getByRole('radio', { name: format, exact: true }).check();
  await dialog.getByRole('button', { name: 'Browse...' }).click();
  await dialog.getByRole('button', { name: 'Export 1 file' }).click();
  await expect.poll(() => readFile(file).then((bytes) => bytes.length, () => 0), { timeout: POLL_MS }).toBeGreaterThan(0);
  await dialog.waitFor({ state: 'detached' });
  return new Uint8Array(await readFile(file));
};

export { exportAnimation };
