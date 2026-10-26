/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { buildFolderArtwork } from './support/build-folder-artwork';
import type { Session } from './support/e2e.type';
import { FOLDER_SHEET } from './support/folder-artwork.constants';
import { inFreshPlace } from './support/in-place';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { openSheetTab } from './support/open-sheet-tab';
import { showSheetList } from './support/show-sheet-list';
import { writeSampleProject } from './support/write-sample-project';

const tableOf = (session: Session) => session.page.getByRole('region', { name: 'Sprites', exact: true });

const rowOf = (session: Session, name: string) => tableOf(session).getByRole('row').filter({ hasText: new RegExp(`^${name}\\d`) });

const selected = (session: Session, name: string): Promise<string | null> => rowOf(session, name).getAttribute('aria-selected');

const shownNames = async (session: Session): Promise<string[]> => {
  const texts = await tableOf(session).locator('[data-marquee-key]').allInnerTexts();
  return texts.map((text) => text.split('\n')[0] ?? '');
};

const checksSelection = async (session: Session): Promise<void> => {
  await rowOf(session, 'hero').click();
  expect(await selected(session, 'hero')).toBe('true');
  expect(await selected(session, 'slime')).toBe('false');
  await rowOf(session, 'slime').click();
  await expect.poll(() => selected(session, 'slime')).toBe('true');
  expect(await selected(session, 'hero')).toBe('false');
  await rowOf(session, 'hero').click({ modifiers: ['Control'] });
  await expect.poll(() => selected(session, 'hero')).toBe('true');
  expect(await selected(session, 'slime')).toBe('true');
  await tableOf(session).getByRole('button', { name: 'Select the sprites in fx', exact: true }).click();
  await expect.poll(() => selected(session, 'fx/glow')).toBe('true');
  expect(await selected(session, 'fx/spark')).toBe('true');
  expect(await selected(session, 'slime')).toBe('false');
};

const checksSortAndKeys = async (session: Session): Promise<void> => {
  expect(await shownNames(session)).toEqual(['fx/glow', 'fx/spark', 'hero', 'slime', 'tiny']);
  await tableOf(session).getByRole('columnheader', { name: /Width/ }).first().hover();
  await tableOf(session).getByRole('button', { name: 'Sort by Width', exact: true }).click();
  await expect.poll(() => shownNames(session)).toEqual(['fx/glow', 'fx/spark', 'tiny', 'hero', 'slime']);
  await rowOf(session, 'fx/spark').click();
  await session.page.keyboard.press('ArrowRight');
  await rowOf(session, 'fx/spark').getByRole('checkbox').focus();
  await session.page.keyboard.press('ArrowDown');
  await expect.poll(() => selected(session, 'tiny')).toBe('true');
  expect(await selected(session, 'fx/spark')).toBe('false');
};

const checksList = async (session: Session, place: string): Promise<void> => {
  const root = join(place, 'Folders');
  await writeSampleProject(root, buildFolderArtwork(), 'Folders');
  await openProjectAtInUi(session, root, 'Folders');
  await openSheetTab(session, FOLDER_SHEET);
  await showSheetList(session);
  await tableOf(session).getByRole('columnheader', { name: /Name/ }).first().waitFor();
  await checksSelection(session);
  await checksSortAndKeys(session);
};

describe('the sheet manager list view', () => {
  test('selects rows and folders, sorts from the column headers and walks the rows in the order shown', async () => {
    const session = await openSession();
    try {
      await inFreshPlace((place) => checksList(session, place));
    } finally {
      await session.close();
    }
  });
});
