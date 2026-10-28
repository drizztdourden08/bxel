/* @layer renderer-app @kind test */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { resolveLinkPath } from '@bxel/document';
import { readAssetManifest } from '@bxel/document/native';
import type { Page } from 'playwright-core';
import { describe, expect, test } from 'vitest';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { buildGalleryArtwork } from './support/build-gallery-artwork';
import { writeSampleProject } from './support/write-sample-project';
import type { Session } from './support/e2e.type';
import { openSession } from './support/open-session';
import { inFreshPlace } from './support/in-place';
import { GALLERY } from './support/gallery.constants';
import { POLL_MS } from './support/e2e.constants';
import { useRig } from './support/use-rig';
import { openHub } from './support/open-hub';

const POLL = { timeout: POLL_MS } as const;

const linkTargets = (path: string): readonly string[] => {
  const manifest = readAssetManifest(new Uint8Array(readFileSync(path)));
  if (!manifest) throw new Error('the file did not read');
  return manifest.links.map((link) => resolveLinkPath(path.replaceAll('\\', '/'), link.path));
};

const slash = (path: string): string => path.replaceAll('\\', '/');

const dragCellToCrumb = async (page: Page, name: string, crumb: string): Promise<void> => {
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  const cell = page.getByRole('gridcell', { name, exact: true }).first();
  const target = page.getByRole('navigation', { name: 'Folder path' }).getByRole('button', { name: crumb, exact: true });
  await cell.dispatchEvent('dragstart', { dataTransfer });
  await target.dispatchEvent('dragenter', { dataTransfer });
  await target.dispatchEvent('dragover', { dataTransfer });
  await target.dispatchEvent('drop', { dataTransfer });
  await cell.dispatchEvent('dragend', { dataTransfer });
};

const movesRenamesAndUndoes = async (session: Session, place: string): Promise<void> => {
  const { page } = session;
  const root = join(place, GALLERY.project);
  const written = await writeSampleProject(root, buildGalleryArtwork(), GALLERY.project);
  const sheetPath = [...written.values()].find((path) => path.endsWith('.bxsheet')) ?? '';
  const spritePath = linkTargets(sheetPath).find((path) => path.endsWith('.bxsprite')) ?? '';
  expect(existsSync(spritePath)).toBe(true);
  const name = spritePath.slice(spritePath.lastIndexOf('/') + 1).replace('.bxsprite', '');
  const movedPath = `${slash(root)}/${name}.bxsprite`;
  const renamedPath = `${slash(root)}/blob.bxsprite`;
  await openProjectAtInUi(session, root, GALLERY.project);
  await openHub(session, 'Project');
  await page.getByRole('gridcell', { name: 'sprites', exact: true }).first().dblclick();
  await page.getByRole('gridcell', { name, exact: true }).first().waitFor(POLL);

  await dragCellToCrumb(page, name, GALLERY.project);
  await page.getByRole('dialog').getByRole('button', { name: 'Move', exact: true }).click();
  await expect.poll(() => existsSync(movedPath) && linkTargets(sheetPath).includes(movedPath), POLL).toBe(true);
  expect(existsSync(spritePath)).toBe(false);
  expect(linkTargets(sheetPath)).not.toContain(spritePath);

  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect.poll(() => existsSync(spritePath) && linkTargets(sheetPath).includes(spritePath), POLL).toBe(true);
  expect(existsSync(movedPath)).toBe(false);

  const cell = page.getByRole('gridcell', { name, exact: true }).first();
  await cell.click();
  await page.keyboard.press('F2');
  const field = page.getByRole('textbox', { name: `Rename ${name}` });
  await field.fill('blob');
  await field.press('Enter');
  const renamed = `${spritePath.slice(0, spritePath.lastIndexOf('/'))}/blob.bxsprite`;
  await expect.poll(() => existsSync(renamed) && linkTargets(sheetPath).includes(renamed), POLL).toBe(true);
  expect(linkTargets(sheetPath)).not.toContain(spritePath);
  expect(existsSync(renamedPath)).toBe(false);

  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect.poll(() => existsSync(spritePath) && linkTargets(sheetPath).includes(spritePath), POLL).toBe(true);
};

describe('moving and renaming a sprite that a sheet uses', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('keeps the sheet linked through a move, a rename and each undo', () => inFreshPlace((place) => movesRenamesAndUndoes(rig().session, place)));
});
