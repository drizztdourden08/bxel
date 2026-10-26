/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, test } from 'vitest';
import { buildGalleryArtwork } from './support/build-gallery-artwork';
import { POLL_MS } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { GALLERY } from './support/gallery.constants';
import { inFreshPlace } from './support/in-place';
import { managerAssets } from './support/manager-assets';
import { openHub } from './support/open-hub';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { shoot } from './support/shoot';
import { useRig } from './support/use-rig';
import { writeSampleProject } from './support/write-sample-project';

const KINDS = [
  { name: 'hero', kind: 'Sprite', fact: '2' },
  { name: GALLERY.sheet, kind: 'Sheet', fact: '2' },
  { name: GALLERY.palette, kind: 'Palette', fact: '16' },
  { name: GALLERY.tileset, kind: 'Tileset', fact: '2' },
  { name: GALLERY.map, kind: 'Tilemap', fact: '8 by 5 cells' },
] as const;

const showsOverview = async (session: Session, entry: (typeof KINDS)[number]): Promise<void> => {
  await openHub(session, 'Project');
  await managerAssets(session).getByRole('listitem').filter({ hasText: entry.name }).first().click();
  await session.page.getByRole('group', { name: `What to do with ${entry.name}` }).getByRole('button', { name: 'Open in Asset settings' }).click();
  await session.page.getByRole('textbox', { name: 'Name' }).waitFor({ timeout: POLL_MS });
  const preview = session.page.getByRole('img', { name: `Full size preview of ${entry.name}` }).or(session.page.getByRole('group', { name: `Full size preview of ${entry.name}` }));
  await preview.first().waitFor({ timeout: POLL_MS });
  await session.page.getByText(entry.kind, { exact: true }).first().waitFor();
  await session.page.getByText(entry.fact, { exact: true }).first().waitFor();
  await shoot(session, `a145-overview-${entry.kind.toLowerCase()}`);
};

const showsEveryKind = async (session: Session, place: string): Promise<void> => {
  const root = join(place, GALLERY.project);
  await writeSampleProject(root, buildGalleryArtwork(), GALLERY.project);
  await openProjectAtInUi(session, root, GALLERY.project);
  for (const entry of KINDS) await showsOverview(session, entry);
};

describe('the overview page of the Asset hub', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('shows a full preview, the kind and the numbers of every kind of asset', () => inFreshPlace((place) => showsEveryKind(rig().session, place)));
});
