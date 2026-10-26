/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { buildSampleArtwork } from './support/build-sample-artwork';
import type { Session } from './support/e2e.type';
import { inFreshPlace } from './support/in-place';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { SAMPLE } from './support/sample.constants';
import { showSheetList } from './support/show-sheet-list';
import { writeSampleProject } from './support/write-sample-project';

const gridOf = (session: Session) => session.page.getByRole('grid', { name: 'Sprites', exact: true });

const selected = (session: Session, name: string): Promise<string | null> =>
  gridOf(session).getByRole('row', { name: new RegExp(`^${name}`) }).getAttribute('aria-selected');

const checksKeys = async (session: Session, place: string): Promise<void> => {
  const root = join(place, 'Sample');
  await writeSampleProject(root, buildSampleArtwork(), SAMPLE.name);
  await openProjectAtInUi(session, root, SAMPLE.name);
  await session.page.getByRole('toolbar', { name: 'Canvas' }).getByRole('button', { name: 'Sheet', exact: true }).click();
  await showSheetList(session);
  const grid = gridOf(session);
  await grid.getByRole('columnheader', { name: 'Name' }).waitFor();
  const hero = grid.getByRole('row', { name: /^hero/ });
  await hero.click();
  expect(await selected(session, 'hero')).toBe('true');
  expect(await selected(session, 'slime')).toBe('false');
  await grid.getByRole('row', { name: /^slime/ }).click();
  await expect.poll(() => selected(session, 'slime')).toBe('true');
  expect(await selected(session, 'hero')).toBe('false');
  await grid.getByRole('columnheader', { name: 'Size' }).getByRole('button').click();
  await expect.poll(() => grid.getByRole('columnheader', { name: 'Size' }).getAttribute('aria-sort')).toBe('ascending');
};

describe('the sheet manager list view', () => {
  test('selects rows with the mouse and sorts from the column headers', async () => {
    const session = await openSession();
    try {
      await inFreshPlace((place) => checksKeys(session, place));
    } finally {
      await session.close();
    }
  });
});
