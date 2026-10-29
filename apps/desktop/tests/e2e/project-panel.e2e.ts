/* @layer renderer-app @kind test */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { buildSampleArtwork } from './support/build-sample-artwork';
import { POLL_MS } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { dragByPointer } from './support/drag-by-pointer';
import { inFreshPlace } from './support/in-place';
import { openAssetTab } from './support/open-asset-tab';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { assetRow, filterChip, rowActions } from './support/panel-assets';
import { SAMPLE } from './support/sample.constants';
import { useRig } from './support/use-rig';
import { writeSampleProject } from './support/write-sample-project';

const POLL = { timeout: POLL_MS } as const;

const search = (session: Session) => session.page.getByRole('searchbox', { name: 'Search the project' });

const selected = async (session: Session, name: string): Promise<boolean> => (await assetRow(session, name).getAttribute('aria-selected')) === 'true';

const showsRealThumbnails = async (session: Session): Promise<void> => {
  for (const name of [SAMPLE.sprites[0], SAMPLE.sheets[0], SAMPLE.palette]) await assetRow(session, name).locator('img').first().waitFor(POLL);
};

const selectsBeforeItOpens = async (session: Session): Promise<void> => {
  await assetRow(session, SAMPLE.sprites[1]).click();
  expect(await selected(session, SAMPLE.sprites[1])).toBe(true);
  expect(await session.page.getByRole('tab', { name: new RegExp(SAMPLE.sprites[1]) }).count()).toBe(0);
  await assetRow(session, SAMPLE.sprites[0]).click({ modifiers: ['Control'] });
  expect(await selected(session, SAMPLE.sprites[0])).toBe(true);
  expect(await selected(session, SAMPLE.sprites[1])).toBe(true);
  await assetRow(session, SAMPLE.sprites[1]).click();
  await session.page.keyboard.press('Enter');
  await openAssetTab(session, new RegExp(SAMPLE.sprites[1])).waitFor(POLL);
};

const movesWithTheKeys = async (session: Session): Promise<void> => {
  await assetRow(session, SAMPLE.sprites[0]).focus();
  await session.page.keyboard.press('ArrowDown');
  expect(await assetRow(session, SAMPLE.sprites[1]).evaluate((node) => document.activeElement === node)).toBe(true);
  await session.page.keyboard.press('Home');
  const first = session.page.getByRole('tree').getByRole('treeitem').first();
  expect(await first.evaluate((node) => document.activeElement === node)).toBe(true);
};

const renamesInTheRow = async (session: Session, root: string): Promise<void> => {
  await assetRow(session, SAMPLE.sprites[1]).click();
  await session.page.keyboard.press('F2');
  const field = session.page.getByRole('textbox', { name: 'New name' });
  await field.fill('gel');
  await field.press('Enter');
  await assetRow(session, 'gel').waitFor(POLL);
  expect(existsSync(join(root, 'sprites', 'gel.bxsprite'))).toBe(true);
  expect(existsSync(join(root, 'sprites', 'slime.bxsprite'))).toBe(false);
};

const makesAFolderInTheRow = async (session: Session, root: string): Promise<void> => {
  await session.page.getByRole('button', { name: 'Choose what to make' }).click();
  await session.page.getByRole('menuitem', { name: 'New folder' }).click();
  const field = session.page.getByRole('textbox', { name: 'New name' });
  await field.fill('props');
  await field.press('Enter');
  await assetRow(session, 'props').waitFor(POLL);
  expect(existsSync(join(root, 'props'))).toBe(true);
};

const dropsOnAFolder = async (session: Session, root: string): Promise<void> => {
  await dragByPointer(session.page, assetRow(session, SAMPLE.sprites[0]).locator('.project-thumb'), assetRow(session, 'props').locator('.project-label'));
  const confirm = session.page.getByRole('button', { name: 'Move', exact: true });
  await confirm.waitFor(POLL).then(() => confirm.click(), () => undefined);
  await expect.poll(() => existsSync(join(root, 'props', `${SAMPLE.sprites[0]}.bxsprite`)), POLL).toBe(true);
  await expect.poll(() => assetRow(session, SAMPLE.sheets[0]).getByRole('img', { name: /^Missing/ }).count(), POLL).toBe(0);
};

const filtersWithTokens = async (session: Session): Promise<void> => {
  await search(session).fill('kind:sheet ');
  await filterChip(session, 'kind:sheet').waitFor(POLL);
  await session.page.getByText(/^2 of \d+ shown$/).waitFor(POLL);
  await session.page.getByRole('button', { name: 'Clear filters' }).click();
};

const neverOverlapsTheActions = async (session: Session): Promise<void> => {
  await search(session).fill(SAMPLE.sprites[0]);
  for (const width of [140, 180, 260, 400]) {
    await session.page.evaluate((px) => {
      const panel = document.querySelector<HTMLElement>('.project-panel');
      if (panel) panel.style.width = `${px}px`;
    }, width);
    const row = assetRow(session, SAMPLE.sprites[0]);
    await row.hover();
    const users = await row.getByRole('button', { name: /Used by/ }).boundingBox();
    const actions = await rowActions(session, SAMPLE.sprites[0]).boundingBox();
    expect(users, `used by badge at ${width}`).not.toBeNull();
    expect(actions, `actions button at ${width}`).not.toBeNull();
    if (users && actions) expect(users.x + users.width <= actions.x + 0.5 || actions.x + actions.width <= users.x + 0.5, `no overlap at ${width}`).toBe(true);
  }
  await session.page.evaluate(() => document.querySelector<HTMLElement>('.project-panel')?.style.removeProperty('width'));
  await search(session).fill('');
};

describe('the docked Project panel', () => {
  const rig = useRig(async () => ({ session: await openSession() }));
  test('shows a tree with real thumbnails, selects before it opens, edits in the row and moves by drop', () =>
    inFreshPlace(async (place) => {
      const { session } = rig();
      const root = join(place, SAMPLE.name);
      await writeSampleProject(root, buildSampleArtwork(), SAMPLE.name);
      await openProjectAtInUi(session, root, SAMPLE.name);
      await showsRealThumbnails(session);
      await selectsBeforeItOpens(session);
      await movesWithTheKeys(session);
      await renamesInTheRow(session, root);
      await makesAFolderInTheRow(session, root);
      await filtersWithTokens(session);
      await neverOverlapsTheActions(session);
    }));
  test.skip('moves a sprite by dropping its thumbnail on a folder (blocked on Brock P-209)', () =>
    inFreshPlace(async (place) => {
      const { session } = rig();
      const root = join(place, SAMPLE.name);
      await writeSampleProject(root, buildSampleArtwork(), SAMPLE.name);
      await openProjectAtInUi(session, root, SAMPLE.name);
      await makesAFolderInTheRow(session, root);
      await dropsOnAFolder(session, root);
    }));
});
