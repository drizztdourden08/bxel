/* @layer renderer-app @kind logic */
import { mkdir, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { expect } from 'vitest';
import { POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';
import { openExportDialog } from './open-export-dialog';

const exportAnimation = async (session: Session, format: 'GIF' | 'APNG'): Promise<Uint8Array> => {
  const folder = join(session.dir, `out-${format}`);
  const extension = format === 'GIF' ? '.gif' : '.png';
  await mkdir(folder, { recursive: true });
  const dialog = await openExportDialog(session, { open: null, save: join(folder, `pick${extension}`) });
  await dialog.getByRole('radio', { name: 'Animation' }).check();
  await dialog.getByRole('radio', { name: format, exact: true }).check();
  await dialog.getByRole('button', { name: 'Browse...' }).click();
  await dialog.getByRole('button', { name: /^Export 1 file/ }).click();
  const written = async (): Promise<string[]> => (await readdir(folder)).filter((name) => name.endsWith(extension) && name !== `pick${extension}`);
  try {
    await expect.poll(async () => (await written()).length, { timeout: POLL_MS }).toBe(1);
  } catch (error) {
    throw new Error(`${String(error)} ${JSON.stringify(await readdir(session.dir, { recursive: true }))} ${await dialog.innerText()}`);
  }
  await dialog.waitFor({ state: 'detached' });
  const [name] = await written();
  return new Uint8Array(await readFile(join(folder, name ?? '')));
};

export { exportAnimation };
