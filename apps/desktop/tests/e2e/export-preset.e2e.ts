/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { createSprite } from './support/create-sprite';
import { POLL_MS, SHORTCUT } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { openExportDialog } from './support/open-export-dialog';
import { openFile } from './support/open-file';
import { openSession } from './support/open-session';
import { readSaved } from './support/read-saved';
import { saveExportPreset } from './support/save-export-preset';
import { saveFile } from './support/save-file';
import { waitSaved } from './support/wait-saved';
import { waitUnsaved } from './support/wait-unsaved';

const NAME = 'Web 2x';

const presetNames = (path: string): string[] => readSaved(path).presets.map((preset) => preset.name);

const savePresetIntoSprite = async (session: Session, path: string): Promise<void> => {
  await createSprite(session);
  await saveFile(session, path);
  const dialog = await openExportDialog(session, { open: null, save: null });
  await saveExportPreset(dialog, NAME);
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await dialog.waitFor({ state: 'detached' });
  await waitUnsaved(session);
  await session.page.keyboard.press(SHORTCUT.save);
  await waitSaved(session);
};

const findPresetInDialog = async (session: Session, path: string): Promise<void> => {
  await openFile(session, path);
  const dialog = await openExportDialog(session, { open: null, save: null });
  await dialog.getByRole('combobox', { name: 'Preset' }).click();
  await session.page.getByRole('option', { name: NAME }).waitFor({ timeout: POLL_MS });
  await session.page.getByText('This asset').waitFor({ timeout: POLL_MS });
};

test('check 8: an export preset saved in the Export window is kept in the sprite file and found again after reopening', async () => {
  const first = await openSession();
  const second = await openSession();
  const path = join(first.dir, 'hero.bxsprite');
  try {
    await savePresetIntoSprite(first, path);
    await expect.poll(() => presetNames(path), { timeout: POLL_MS }).toEqual([NAME]);
    await findPresetInDialog(second, path);
  } finally {
    await second.close();
    await first.close();
  }
});
