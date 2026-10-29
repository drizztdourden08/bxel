/* @layer renderer-app @kind test */
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { decodeProject } from '@bxel/project';
import { describe, expect, test } from 'vitest';
import { POLL_MS } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { GALLERY } from './support/gallery.constants';
import { inFreshPlace } from './support/in-place';
import { linkTargets, slash } from './support/link-targets';
import { openHealth } from './support/open-health';
import { openHub } from './support/open-hub';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { setWindow } from './support/set-window';
import { shoot } from './support/shoot';
import { useRig } from './support/use-rig';
import { writeGalleryProject } from './support/write-gallery-project';

const POLL = { timeout: POLL_MS } as const;

const repairsAMovedFile = async (session: Session, place: string): Promise<void> => {
  const { page } = session;
  const { root, sheetPath, spritePath } = await writeGalleryProject(place);
  await openProjectAtInUi(session, root, GALLERY.project);
  await setWindow(session);
  await openHealth(session);
  await page.getByText('No problems found', { exact: true }).first().waitFor(POLL);
  await shoot(session, 'project-mgmt-p4-1-health-clean');

  const moved = `${slash(root)}/sprites/heroes/${spritePath.slice(spritePath.lastIndexOf('/') + 1)}`;
  await mkdir(join(root, 'sprites', 'heroes'), { recursive: true });
  await rename(spritePath, moved);
  await page.getByRole('region', { name: 'Links with an old path' }).waitFor(POLL);
  await shoot(session, 'project-mgmt-p4-2-health-moved-links');

  await page.getByRole('button', { name: 'Fix all', exact: true }).click();
  await expect.poll(() => linkTargets(sheetPath).includes(moved), POLL).toBe(true);
  expect(linkTargets(sheetPath)).not.toContain(spritePath);
  await page.getByText('No problems found', { exact: true }).first().waitFor(POLL);
  await shoot(session, 'project-mgmt-p4-3-health-repaired');
};

const organiseOf = (projectFile: string): string => {
  const decoded = decodeProject(new Uint8Array(readFileSync(projectFile)));
  const organise = decoded.ok ? decoded.value.manifest.organise : undefined;
  if (organise === undefined) return '';
  return `${Object.values(organise.tags).flat().sort().join(',')}|${organise.collections[0]?.name}|${organise.collections[0]?.assets.length}|${organise.pinned.length}`;
};

const clicksMenuItems = async (session: Session, name: string): Promise<void> => {
  const { page } = session;
  const cell = page.getByRole('gridcell', { name, exact: true }).first();
  await cell.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Add to collection' }).click();
  await page.getByRole('menuitemcheckbox', { name: 'Players' }).click();
  await cell.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Pin', exact: true }).click();
};

const organisesFiles = async (session: Session, place: string, viaMenu: boolean): Promise<void> => {
  const { page } = session;
  const { root, spritePath } = await writeGalleryProject(place);
  const name = spritePath.slice(spritePath.lastIndexOf('/') + 1).replace('.bxsprite', '');
  await openProjectAtInUi(session, root, GALLERY.project);
  await setWindow(session);
  await openHub(session, 'Project');
  await page.getByLabel('Search the project').fill('kind:sprite');
  const cell = page.getByRole('gridcell', { name, exact: true }).first();
  await cell.click();
  const tags = page.getByRole('complementary', { name: 'Preview' }).getByRole('textbox', { name: 'Add a tag' });
  await tags.fill('player, big');
  await tags.press('Enter');
  await page.getByRole('group', { name: 'Tags of this file' }).getByText('player', { exact: true }).waitFor(POLL);
  const collection = page.getByRole('textbox', { name: 'New collection' });
  await collection.fill('Players');
  await collection.press('Enter');
  await page.getByRole('tree', { name: 'Collections' }).waitFor(POLL);
  await cell.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Add to collection' }).waitFor(POLL);
  await page.getByRole('menuitem', { name: 'Pin', exact: true }).waitFor(POLL);
  await page.keyboard.press('Escape');
  if (viaMenu) await clicksMenuItems(session, name);
  const projectFile = join(root, `${GALLERY.project}.bxproject`);
  await expect.poll(() => organiseOf(projectFile), POLL).toBe(viaMenu ? 'big,player|Players|1|1' : 'big,player|Players|0|0');
  await page.getByLabel('Search the project').fill(viaMenu ? 'tag:player collection:players is:pinned' : 'tag:player tag:big');
  await page.getByRole('gridcell', { name, exact: true }).first().waitFor(POLL);
  expect(await page.getByRole('gridcell').count()).toBe(1);
  expect(existsSync(projectFile)).toBe(true);
};

describe('the Health page and the organise block', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('lists a file moved in Explorer as a link with an old path and repairs it with Fix all', () => inFreshPlace((place) => repairsAMovedFile(rig().session, place)));

  test('keeps tags and collections in the project file and finds files by tag', () => inFreshPlace((place) => organisesFiles(rig().session, place, false)));

  test.skip('adds to a collection and pins from the context menu, blocked on Tessera P-274 and P-275', () => inFreshPlace((place) => organisesFiles(rig().session, place, true)));
});
