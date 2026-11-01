/* @layer renderer-app @kind test */
import { existsSync } from 'node:fs';
import type { Page } from 'playwright-core';
import { describe, expect, test } from 'vitest';
import { linkTargets, slash } from './support/link-targets';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { writeGalleryProject } from './support/write-gallery-project';
import type { Session } from './support/e2e.type';
import { openSession } from './support/open-session';
import { inFreshPlace } from './support/in-place';
import { GALLERY } from './support/gallery.constants';
import { POLL_MS } from './support/e2e.constants';
import { useRig } from './support/use-rig';
import { openHub } from './support/open-hub';

const POLL = { timeout: POLL_MS } as const;

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
  const { root, sheetPath, spritePath } = await writeGalleryProject(place);
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

  await page.getByRole('button', { name: 'Undo', exact: true }).last().click();
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

  await page.getByRole('button', { name: 'Undo', exact: true }).last().click();
  await expect.poll(() => existsSync(spritePath) && linkTargets(sheetPath).includes(spritePath), POLL).toBe(true);
};

describe('E1 move and rename a project file', { tags: ['e2e'] }, () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('keeps the sheet linked through a move, a rename and each undo', () => inFreshPlace((place) => movesRenamesAndUndoes(rig().session, place)));
});
