/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { buildGalleryArtwork } from './support/build-gallery-artwork';
import { POLL_MS } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { GALLERY } from './support/gallery.constants';
import { inFreshPlace } from './support/in-place';
import { openAssetTab } from './support/open-asset-tab';
import { openHub } from './support/open-hub';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { SAMPLE } from './support/sample.constants';
import { shoot } from './support/shoot';
import { useRig } from './support/use-rig';
import { writeSampleProject } from './support/write-sample-project';

const CAVE = 'Cave';

const cell = (session: Session, name: string) => session.page.getByRole('gridcell', { name, exact: true }).first();

const search = async (session: Session, text: string): Promise<void> => {
  const box = session.page.getByRole('searchbox', { name: 'Search the project' }).or(session.page.getByRole('textbox', { name: 'Search the project' }));
  await box.first().fill(text);
};

const projectRow = (session: Session, name: string) => session.page.getByRole('list', { name: 'Projects' }).getByRole('listitem').filter({ hasText: name });

const writeBoth = async (place: string): Promise<{ readonly sample: string; readonly cave: string }> => {
  const sample = join(place, SAMPLE.name);
  const cave = join(place, CAVE);
  await writeSampleProject(sample, buildGalleryArtwork(), SAMPLE.name, true);
  await writeSampleProject(cave, buildGalleryArtwork(), CAVE, true);
  return { sample, cave };
};

const listsEveryProject = async (session: Session, place: string): Promise<void> => {
  const { sample, cave } = await writeBoth(place);
  await openProjectAtInUi(session, cave, CAVE);
  await openProjectAtInUi(session, sample, SAMPLE.name);
  await openHub(session, 'Project');
  await session.page.getByRole('button', { name: 'Projects', exact: true }).first().click();
  await projectRow(session, CAVE).waitFor();
  await projectRow(session, SAMPLE.name).getByText('Open', { exact: true }).waitFor();
  await projectRow(session, CAVE).click();
  await session.page.getByRole('toolbar', { name: 'Browse' }).waitFor({ timeout: POLL_MS });
  await session.page.getByText(/This project is closed/).waitFor();
  await search(session, SAMPLE.sprites[0]);
  await cell(session, SAMPLE.sprites[0]).waitFor({ timeout: POLL_MS });
  expect(await session.page.getByRole('button', { name: 'New', exact: true }).isDisabled()).toBe(true);
  await shoot(session, 'pm-closed-project');
  await session.page.getByRole('button', { name: 'Open project', exact: true }).click();
  await projectRow(session, CAVE).getByText('Open', { exact: true }).waitFor({ timeout: POLL_MS });
};

const openGallery = async (session: Session, place: string): Promise<void> => {
  const root = join(place, GALLERY.project);
  await writeSampleProject(root, buildGalleryArtwork(), GALLERY.project);
  await openProjectAtInUi(session, root, GALLERY.project);
  await openHub(session, 'Project');
};

const browsesInThreeViews = async (session: Session, place: string): Promise<void> => {
  await openGallery(session, place);
  await session.page.getByRole('toolbar', { name: 'Browse' }).waitFor({ timeout: POLL_MS });
  await search(session, 'kind:sprite');
  await cell(session, 'hero').waitFor({ timeout: POLL_MS });
  await cell(session, 'hero').click();
  await session.page.getByRole('button', { name: 'Properties', exact: true }).waitFor();
  await shoot(session, 'pm-grid');
  await session.page.getByRole('radio', { name: 'List' }).click();
  await session.page.getByRole('group', { name: 'Search filters' }).getByText('kind:sprite').waitFor();
  await session.page.getByRole('button', { name: /^Name$/ }).waitFor();
  await shoot(session, 'pm-list');
  await session.page.getByRole('radio', { name: 'Columns' }).click();
  await shoot(session, 'pm-columns');
  await session.page.getByRole('radio', { name: 'Grid' }).click();
  expect(await cell(session, 'hero').getAttribute('aria-selected')).toBe('true');
};

const playsAnAnimation = async (session: Session, place: string): Promise<void> => {
  await openGallery(session, place);
  await search(session, 'kind:animation');
  const animation = session.page.getByRole('gridcell').first();
  await animation.waitFor({ timeout: POLL_MS });
  await animation.click();
  const counter = session.page.getByRole('status').filter({ hasText: /^Frame \d+ of \d+$/ });
  await counter.waitFor({ timeout: POLL_MS });
  const before = await counter.textContent();
  await session.page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect.poll(() => counter.textContent(), { timeout: POLL_MS }).not.toBe(before);
  await shoot(session, 'pm-preview-playing');
  await session.page.getByRole('button', { name: 'Pause', exact: true }).click();
};

const opensTheFileOnDoubleClick = async (session: Session, place: string): Promise<void> => {
  await openGallery(session, place);
  await search(session, 'hero');
  await cell(session, 'hero').dblclick();
  await expect.poll(() => openAssetTab(session, /hero/).getAttribute('aria-selected'), { timeout: POLL_MS }).toBe('true');
};

describe('the Project window', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('lists every project and browses a closed one read only', () => inFreshPlace((place) => listsEveryProject(rig().session, place)));
});

describe('the Browse page', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('shows the same files in grid, list and columns and keeps the selection', () => inFreshPlace((place) => browsesInThreeViews(rig().session, place)));
});

describe('the preview pane', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('plays an animation', () => inFreshPlace((place) => playsAnAnimation(rig().session, place)));
});

describe('opening from the Browse page', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('a double click opens the file in a tab', () => inFreshPlace((place) => opensTheFileOnDoubleClick(rig().session, place)));
});
