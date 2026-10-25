/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { BLOCKS } from './support/blocks.constants';
import { SHORTCUT } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { flatIndices } from './support/flat-indices';
import { openAssetTab } from './support/open-asset-tab';
import { openSession } from './support/open-session';
import { readSaved } from './support/read-saved';
import { saveFile } from './support/save-file';
import { spriteOf } from './support/sprite-of';
import { waitSaved } from './support/wait-saved';
import { writeBlocksPng } from './support/write-blocks-png';

const wizardFor = async (session: Session, path: string) => {
  await answerDialogs(session, { open: path, save: null });
  await session.page.keyboard.press(SHORTCUT.importImage);
  const dialog = session.page.getByRole('dialog', { name: /^Import image/ });
  await dialog.getByRole('button', { name: 'Next: Colours' }).click();
  return dialog;
};

describe('check 2: a PNG with more than 16 colours is reduced to the palette', () => {
  const state: { session?: Session; png?: string } = {};
  const live = () => {
    if (!state.session) throw new Error('no session');
    return state.session;
  };

  beforeAll(async () => {
    state.session = await openSession();
    state.png = await writeBlocksPng(live().dir);
  });

  afterAll(async () => {
    await state.session?.close();
  });

  test('cancel leaves the file and its history unchanged', async () => {
    const session = live();
    const dialog = await wizardFor(session, state.png ?? '');
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await dialog.waitFor({ state: 'detached' });
    expect(await session.page.getByRole('button', { name: 'Nothing to undo' }).count()).toBe(1);
    expect(await session.page.getByText('sprite.bxsprite - Bxel').count()).toBe(1);
    await waitSaved(session);
  });

  test('shows the original beside the reduced preview and imports only palette swatches without dithering', async () => {
    const session = live();
    const dialog = await wizardFor(session, state.png ?? '');
    await dialog.getByRole('application', { name: `Original, ${BLOCKS.count} colours` }).waitFor();
    await dialog.getByRole('application', { name: /^Palette-mapped, \d+ of 15 opaque used$/ }).waitFor();
    await dialog.getByText('Advanced').click();
    await dialog.getByRole('radio', { name: 'None (default)' }).check();
    await dialog.getByRole('button', { name: 'Import sprite' }).click();
    await dialog.waitFor({ state: 'detached' });
    await openAssetTab(session, /blocks/).click();
    const path = join(session.dir, 'imported.bxsprite');
    await saveFile(session, path);
    const artwork = readSaved(path);
    const sprite = spriteOf(artwork, 'imported');
    const cap = artwork.banks.find((bank) => bank.id === sprite.bankId)?.cap ?? 0;
    const pixels = flatIndices(sprite);
    expect(pixels.length).toBe(BLOCKS.width * BLOCKS.height);
    expect(pixels.every((index) => index >= 1 && index < cap)).toBe(true);
    for (let block = 0; block < BLOCKS.count; block += 1) {
      const origin = (Math.floor(block / BLOCKS.columns) * BLOCKS.width + (block % BLOCKS.columns)) * BLOCKS.side;
      const seen = new Set<number>();
      for (let at = 0; at < BLOCKS.side * BLOCKS.side; at += 1) seen.add(pixels[origin + Math.floor(at / BLOCKS.side) * BLOCKS.width + (at % BLOCKS.side)] ?? 0);
      expect(seen.size, `block ${block} keeps one swatch`).toBe(1);
    }
  });
});
