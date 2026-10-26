/* @layer renderer-app @kind logic */
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { expect } from 'vitest';
import { EXPORT_DONE_MS, POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';
import { openExportDialog } from './open-export-dialog';

type Exported = ReadonlyMap<string, Uint8Array>;

const exportAnimationFiles = async (session: Session, format: 'GIF' | 'APNG', count: number): Promise<Exported> => {
  const extension = format === 'GIF' ? '.gif' : '.png';
  const folder = await mkdtemp(join(process.cwd(), 'e2e-out-'));
  try {
    const dialog = await openExportDialog(session, { open: folder, save: null });
    await dialog.getByRole('radio', { name: 'Animation', checked: true }).waitFor();
    await dialog.getByRole('radio', { name: format, exact: true }).check();
    await dialog.getByRole('button', { name: 'Browse...' }).click();
    await expect.poll(() => dialog.getByRole('textbox', { name: 'Folder to save to' }).inputValue(), { timeout: POLL_MS }).toContain('e2e-out-');
    await dialog.getByRole('button', { name: new RegExp(`^Export ${count} files?`) }).click();
    await dialog.waitFor({ state: 'detached' });
    await session.page.getByText(new RegExp(`^Exported ${count} files? to .*${basename(folder)}`)).waitFor({ timeout: EXPORT_DONE_MS });
    const names = (await readdir(folder)).filter((each) => each.endsWith(extension));
    const files = await Promise.all(names.map(async (name) => [name, new Uint8Array(await readFile(join(folder, name)))] as const));
    return new Map(files);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
};

const exportAnimation = async (session: Session, format: 'GIF' | 'APNG'): Promise<Uint8Array> => {
  const [first] = (await exportAnimationFiles(session, format, 1)).values();
  return first ?? new Uint8Array();
};

export { exportAnimation, exportAnimationFiles };
