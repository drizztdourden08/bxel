/* @layer renderer-app @kind logic */
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { Session } from './e2e.type';
import { finishExport } from './finish-export';
import { openExportDialog } from './open-export-dialog';

const exportSpritePng = async (session: Session, scale: number): Promise<Uint8Array> => {
  const folder = join(session.dir, 'png-out');
  const file = join(folder, 'sprite.png');
  await mkdir(folder, { recursive: true });
  const dialog = await openExportDialog(session, { open: null, save: file });
  await dialog.getByRole('spinbutton', { name: 'Scale' }).fill(String(scale));
  return finishExport(dialog, file);
};

export { exportSpritePng };
