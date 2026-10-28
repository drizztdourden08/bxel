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

const FOLDER_STRAY = 'stray';

const tableOf = (session: Session) => session.page.getByRole('region', { name: 'Sprites', exact: true });

const rowOf = (session: Session, name: string) => tableOf(session).getByRole('row').filter({ hasText: new RegExp(`^${name}\\d`) });

const selected = (session: Session, name: string): Promise<string | null> => rowOf(session, name).getAttribute('aria-selected');

const shownNames = async (session: Session): Promise<string[]> => {
  const texts = await tableOf(session).locator('[data-marquee-key]').allInnerTexts();
  return texts.map((text) => text.split('\n')[0] ?? '');
};

const stateOf = (session: Session, name: string): Promise<string | null> => rowOf(session, name).getAttribute('data-state');

const checksMarks = async (session: Session): Promise<void> => {
  expect(await rowOf(session, 'hero').locator('canvas').count()).toBe(1);
  await rowOf(session, 'hero').click();
  await expect.poll(() => stateOf(session, 'hero')).toBe('active');
  expect(await stateOf(session, 'slime')).toBeNull();
  expect(await rowOf(session, FOLDER_STRAY).count()).toBe(0);
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
  await rowOf(session, 'fx/glow').click({ modifiers: ['Control'] });
  await expect.poll(() => selected(session, 'fx/glow')).toBe('true');
  expect(await selected(session, 'tiny')).toBe('false');
};

const checksSortAndKeys = async (session: Session): Promise<void> => {
  expect(await shownNames(session)).toEqual(['hero', 'slime', 'tiny', 'fx/glow', 'fx/spark']);
  await tableOf(session).getByRole('columnheader', { name: /Width/ }).first().hover();
  await tableOf(session).getByRole('button', { name: 'Sort by Width', exact: true }).click();
  await expect.poll(() => shownNames(session)).toEqual(['tiny', 'hero', 'slime', 'fx/glow', 'fx/spark']);
  await rowOf(session, 'slime').click();
  await session.page.keyboard.press('ArrowRight');
  await rowOf(session, 'slime').getByRole('checkbox').focus();
  await session.page.keyboard.press('ArrowDown');
  await expect.poll(() => selected(session, 'fx/glow')).toBe('true');
  expect(await selected(session, 'slime')).toBe('false');
};

const checksList = async (session: Session, place: string): Promise<void> => {
  const root = join(place, 'Folders');
  await writeSampleProject(root, buildFolderArtwork(), 'Folders');
  await openProjectAtInUi(session, root, 'Folders');
  await openSheetTab(session, FOLDER_SHEET);
  await showSheetList(session);
  await tableOf(session).getByRole('columnheader', { name: /Name/ }).first().waitFor();
  await checksMarks(session);
  await checksSelection(session);
  await checksSortAndKeys(session);
};

describe('the sheet manager list view', () => {
  test('shows thumbnails and row marks, selects rows and folders, sorts from the column headers and walks the rows in the order shown', async () => {
    const session = await openSession();
    try {
      await inFreshPlace((place) => checksList(session, place));
    } finally {
      await session.close();
    }
  });
});
