/* @layer renderer-app @kind logic */
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { expect } from 'vitest';
import { EXPORT_DONE_MS, POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';
import { openExportDialog } from './open-export-dialog';

const exportAnimation = async (session: Session, format: 'GIF' | 'APNG'): Promise<Uint8Array> => {
  const extension = format === 'GIF' ? '.gif' : '.png';
  const folder = await mkdtemp(join(process.cwd(), 'e2e-out-'));
  try {
    const dialog = await openExportDialog(session, { open: folder, save: null });
    await dialog.getByRole('radio', { name: 'Animation', checked: true }).waitFor();
    await dialog.getByRole('radio', { name: format, exact: true }).check();
    await dialog.getByRole('button', { name: 'Browse...' }).click();
    await expect.poll(() => dialog.getByRole('textbox', { name: 'Folder to save to' }).inputValue(), { timeout: POLL_MS }).toContain('e2e-out-');
    await dialog.getByRole('button', { name: /^Export 1 file/ }).click();
    await dialog.waitFor({ state: 'detached' });
    await session.page.getByText(/^Exported 1 file to /).waitFor({ timeout: EXPORT_DONE_MS });
    const [name] = (await readdir(folder)).filter((each) => each.endsWith(extension));
    return new Uint8Array(await readFile(join(folder, name ?? '')));
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
};

export { exportAnimation };
