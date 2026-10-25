/* @layer renderer-app @kind logic */
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { Session } from './e2e.type';
import { finishExport } from './finish-export';
import { openExportDialog } from './open-export-dialog';

const exportAnimation = async (session: Session, format: 'GIF' | 'APNG'): Promise<Uint8Array> => {
  const folder = join(session.dir, `out-${format}`);
  const file = join(folder, `walk.${format === 'GIF' ? 'gif' : 'png'}`);
  await mkdir(folder, { recursive: true });
  const dialog = await openExportDialog(session, { open: null, save: file });
  await dialog.getByRole('radio', { name: 'Animation' }).check();
  await dialog.getByRole('radio', { name: format, exact: true }).check();
  return finishExport(dialog, file);
};

export { exportAnimation };
