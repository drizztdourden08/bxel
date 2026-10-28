/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { buildFolderArtwork } from './support/build-folder-artwork';
import type { Session } from './support/e2e.type';
import { FOLDER_ANIMATION, FOLDER_SHEET, FOLDER_STRAY } from './support/folder-artwork.constants';
import { inFreshPlace } from './support/in-place';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { openSheetTab } from './support/open-sheet-tab';
import { writeSampleProject } from './support/write-sample-project';

const grid = (session: Session) => session.page.getByRole('grid', { name: 'Sprites', exact: true });

const tile = (session: Session, name: string) => grid(session).getByRole('gridcell', { name: new RegExp(`^${name},`) });

const names = async (session: Session): Promise<string[]> => {
  const labels = await grid(session).getByRole('gridcell').evaluateAll((cells) => cells.map((cell) => cell.getAttribute('aria-label') ?? ''));
  return labels.map((label) => label.split(',')[0] ?? '');
};

const showsTheEntriesOfTheSheet = async (session: Session): Promise<void> => {
  await expect.poll(() => names(session)).toEqual(['hero', 'slime', 'tiny', 'fx/glow', 'fx/spark', FOLDER_ANIMATION]);
  expect(await tile(session, FOLDER_ANIMATION).getAttribute('aria-label')).toContain('animation, 2 frames');
  expect(await tile(session, FOLDER_STRAY).count()).toBe(0);
  await session.page.getByRole('button', { name: 'Open the layout settings' }).waitFor();
};

const picksAndRemoves = async (session: Session): Promise<void> => {
  await tile(session, FOLDER_ANIMATION).click();
  await tile(session, 'tiny').click({ modifiers: ['Control'] });
  await session.page.getByRole('toolbar', { name: 'Actions for the picked entries' }).waitFor();
  await session.page.keyboard.press('Backspace');
  await expect.poll(() => names(session)).toEqual(['hero', 'slime', 'fx/glow', 'fx/spark']);
  await session.page.keyboard.press('Control+z');
  await expect.poll(() => names(session)).toHaveLength(6);
};

const libraryHoldsTheRest = async (session: Session): Promise<void> => {
  const library = session.page.getByRole('grid', { name: 'Library', exact: true });
  await session.page.getByRole('button', { name: /^Library/ }).first().click();
  await library.getByRole('gridcell', { name: new RegExp(`^${FOLDER_STRAY},`) }).waitFor();
  await library.getByRole('gridcell', { name: new RegExp(`^${FOLDER_STRAY},`) }).dblclick();
  await expect.poll(() => names(session)).toContain(FOLDER_STRAY);
};

describe('the sheet widget', () => {
  test('lists the entries of the open sheet, picks and removes them, and adds from the library', async () => {
    const session = await openSession();
    try {
      await inFreshPlace(async (place) => {
        const root = join(place, 'Folders');
        await writeSampleProject(root, buildFolderArtwork(true), 'Folders');
        await openProjectAtInUi(session, root, 'Folders');
        await openSheetTab(session, FOLDER_SHEET);
        await showsTheEntriesOfTheSheet(session);
        await picksAndRemoves(session);
        await libraryHoldsTheRest(session);
      });
    } finally {
      await session.close();
    }
  });
});
