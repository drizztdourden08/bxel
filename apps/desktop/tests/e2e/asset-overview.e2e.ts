/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, test } from 'vitest';
import { buildGalleryArtwork } from './support/build-gallery-artwork';
import { POLL_MS } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { GALLERY } from './support/gallery.constants';
import { inFreshPlace } from './support/in-place';
import { openHub } from './support/open-hub';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { shoot } from './support/shoot';
import { useRig } from './support/use-rig';
import { writeSampleProject } from './support/write-sample-project';

const KINDS = [
  { name: 'hero', kind: 'Animation', fact: '2' },
  { name: GALLERY.sheet, kind: 'Sheet', fact: '2' },
  { name: GALLERY.palette, kind: 'Palette', fact: '16' },
  { name: GALLERY.tileset, kind: 'Tileset', fact: '2' },
  { name: GALLERY.map, kind: 'Tilemap', fact: '8 by 5 cells' },
] as const;

const showsProperties = async (session: Session, entry: (typeof KINDS)[number]): Promise<void> => {
  const { page } = session;
  await openHub(session, 'Project');
  await page.getByRole('textbox', { name: 'Search the project' }).fill(`kind:${entry.kind.toLowerCase()} ${entry.name}`);
  await page.getByRole('gridcell', { name: entry.name, exact: true }).first().click();
  await page.getByRole('button', { name: 'Properties', exact: true }).click();
  await page.getByRole('textbox', { name: 'Name' }).waitFor({ timeout: POLL_MS });
  await page.getByRole('button', { name: 'Unpin, follow the selected tab' }).waitFor();
  const preview = page.getByRole('img', { name: entry.name }).or(page.getByRole('group', { name: new RegExp(`^${entry.name}, `) }));
  await preview.first().waitFor({ timeout: POLL_MS });
  await page.getByText(entry.kind, { exact: true }).first().waitFor();
  await page.getByText(entry.fact, { exact: true }).first().waitFor();
  await shoot(session, `pm-properties-${entry.kind.toLowerCase()}`);
  await page.keyboard.press('Escape');
};

const showsEveryKind = async (session: Session, place: string): Promise<void> => {
  const root = join(place, GALLERY.project);
  await writeSampleProject(root, buildGalleryArtwork(), GALLERY.project);
  await openProjectAtInUi(session, root, GALLERY.project);
  for (const entry of KINDS) await showsProperties(session, entry);
};

describe('the Properties window', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('names the file, shows its preview, kind and numbers, and stays pinned to it', () => inFreshPlace((place) => showsEveryKind(rig().session, place)));
});
