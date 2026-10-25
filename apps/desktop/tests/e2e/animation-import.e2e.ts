/* @layer renderer-app @kind test */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { apngBytes } from './support/apng-bytes';
import { SHORTCUT } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { gifBytes } from './support/gif-bytes';
import { IMPORTED_ANIMATION } from './support/imported-animation.constants';
import { openAssetTab } from './support/open-asset-tab';
import { openSession } from './support/open-session';
import { readSaved } from './support/read-saved';
import { saveFile } from './support/save-file';
import { spriteOf } from './support/sprite-of';

const { delaysMs, gifFile, apngFile, gifName, apngName } = IMPORTED_ANIMATION;

const importFile = async (session: Session, path: string): Promise<void> => {
  await answerDialogs(session, { open: path, save: null });
  await session.page.keyboard.press(SHORTCUT.importImage);
  const dialog = session.page.getByRole('dialog', { name: /^Import image/ });
  await dialog.getByText(/^Animation with 3 frames/).waitFor();
  await dialog.getByRole('button', { name: 'Next: Colours' }).click();
  await dialog.getByRole('radio', { name: /^Extract the best/ }).check();
  await dialog.getByRole('button', { name: 'Import sprite' }).click();
  await dialog.waitFor({ state: 'detached' });
};

const firstIndexes = (sprite: ReturnType<typeof spriteOf>): (number | undefined)[] =>
  sprite.frames.map((frame) => {
    const celId = sprite.layers[0]?.cels[frame.id];
    return celId ? sprite.cels[celId]?.pixels[0] : undefined;
  });

describe('a GIF and an APNG import as frames with their durations', () => {
  const state: { session?: Session } = {};
  const live = () => {
    if (!state.session) throw new Error('no session');
    return state.session;
  };

  beforeAll(async () => {
    state.session = await openSession();
    await writeFile(join(live().dir, gifFile), gifBytes(delaysMs.length));
    await writeFile(join(live().dir, apngFile), apngBytes(delaysMs.length));
  });

  afterAll(async () => {
    await state.session?.close();
  });

  test.each([
    ['GIF', gifFile, gifName],
    ['APNG', apngFile, apngName],
  ])('the %s arrives as one sprite with a frame for every picture', async (_, file, name) => {
    const session = live();
    await importFile(session, join(session.dir, file));
    await openAssetTab(session, new RegExp(name)).click();
    const path = join(session.dir, `${name}-saved.bxsprite`);
    await saveFile(session, path);
    const sprite = spriteOf(readSaved(path), `${name}-saved`);
    expect(sprite.frames.map((frame) => frame.durationMs)).toEqual(delaysMs);
    expect(new Set(firstIndexes(sprite)).size).toBe(delaysMs.length);
  });
});
