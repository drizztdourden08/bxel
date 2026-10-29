/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { buildFolderArtwork } from './support/build-folder-artwork';
import type { Session } from './support/e2e.type';
import { FOLDER_ANIMATION, FOLDER_SHEET, FOLDER_STRAY } from './support/folder-artwork.constants';
import { inFreshPlace } from './support/in-place';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { resizeWindow } from './support/resize-window';
import { openSheetTab } from './support/open-sheet-tab';
import { writeSampleProject } from './support/write-sample-project';

const grid = (session: Session) => session.page.getByRole('grid', { name: 'Sprites', exact: true });

const tile = (session: Session, name: string) => grid(session).getByRole('gridcell', { name: new RegExp(`^${name},`) });

const scrollTo = (session: Session, end: boolean): Promise<void> =>
  grid(session).evaluate((element, toEnd) => {
    const scroller = element.closest('[data-vg-root], .virtual-box') ?? element;
    scroller.scrollTop = toEnd ? scroller.scrollHeight : 0;
  }, end);

const scrollEnd = (session: Session): Promise<void> => scrollTo(session, true);

const names = async (session: Session): Promise<string[]> => {
  const labels = await grid(session).getByRole('gridcell').evaluateAll((cells) => cells.map((cell) => cell.getAttribute('aria-label') ?? ''));
  return labels.map((label) => label.split(',')[0] ?? '');
};

const showsTheEntriesOfTheSheet = async (session: Session): Promise<void> => {
  await expect.poll(() => names(session)).toEqual(expect.arrayContaining(['hero', 'slime', 'tiny']));
  await scrollEnd(session);
  await expect.poll(() => names(session)).toContain(FOLDER_ANIMATION);
  expect(await tile(session, FOLDER_ANIMATION).getAttribute('aria-label')).toContain('animation, 2 frames');
  expect(await tile(session, FOLDER_STRAY).count()).toBe(0);
  await session.page.getByRole('button', { name: 'Open the layout settings' }).waitFor();
};

const picksAndRemoves = async (session: Session): Promise<void> => {
  await scrollTo(session, false);
  await tile(session, 'tiny').click();
  await scrollEnd(session);
  await tile(session, FOLDER_ANIMATION).click({ modifiers: ['Control'] });
  await session.page.getByRole('toolbar', { name: 'Actions for the picked entries' }).waitFor();
  await tile(session, FOLDER_ANIMATION).click({ button: 'right' });
  await session.page.getByText('Sheet', { exact: true }).last().click();
  await session.page.getByText('Remove from sheet', { exact: true }).last().click();
  await expect.poll(async () => (await names(session)).includes(FOLDER_ANIMATION)).toBe(false);
  await session.page.keyboard.press('Control+z');
  await scrollEnd(session);
  await expect.poll(() => names(session)).toContain(FOLDER_ANIMATION);
};

const libraryHoldsTheRest = async (session: Session): Promise<void> => {
  const library = session.page.getByRole('grid', { name: 'Library', exact: true });
  await session.page.getByRole('button', { name: 'Add', exact: true }).click();
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
        await resizeWindow(session, 1280, 800);
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
