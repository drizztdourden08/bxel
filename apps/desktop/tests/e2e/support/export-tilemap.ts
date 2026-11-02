/* @layer renderer-app @kind logic */
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { expect } from 'vitest';
import { APP_DIR, EXPORT_DONE_MS, TEMP_PREFIX } from './e2e.constants';
import type { Session } from './e2e.type';
import { openExportDialog } from './open-export-dialog';
import { watchExportToast } from './watch-export-toast';

const exportTilemap = async (session: Session, format: 'Bxel map JSON' | 'Tiled JSON'): Promise<string> => {
  const folder = await mkdtemp(join(APP_DIR, '..', '..', `${TEMP_PREFIX}out-`));
  const file = join(folder, format === 'Tiled JSON' ? 'Map.tmj' : 'Map.json');
  try {
    const dialog = await openExportDialog(session, { open: folder, save: null });
    await dialog.getByRole('radio', { name: 'Tilemap' }).check();
    await dialog.getByRole('radio', { name: format, exact: true }).check();
    await dialog.getByRole('button', { name: 'Browse...' }).click();
    await expect.poll(() => dialog.getByRole('textbox', { name: 'Folder to save to' }).inputValue(), { timeout: EXPORT_DONE_MS }).toContain(TEMP_PREFIX);
    const exported = await watchExportToast(session.page, basename(folder));
    await dialog.getByRole('button', { name: 'Export 2 files' }).click();
    await dialog.waitFor({ state: 'detached' });
    await exported();
    return await readFile(file, 'utf8');
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
};

export { exportTilemap };
