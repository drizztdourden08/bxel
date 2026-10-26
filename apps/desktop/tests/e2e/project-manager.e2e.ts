/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { buildGalleryArtwork } from './support/build-gallery-artwork';
import { POLL_MS } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { inFreshPlace } from './support/in-place';
import { openAssetTab } from './support/open-asset-tab';
import { openHub } from './support/open-hub';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { managerAssets } from './support/manager-assets';
import { SAMPLE } from './support/sample.constants';
import { shoot } from './support/shoot';
import { useRig } from './support/use-rig';
import { writeSampleProject } from './support/write-sample-project';

const CAVE = 'Cave';

const assetRow = (session: Session, name: string) => managerAssets(session).getByRole('listitem').filter({ hasText: name }).first();

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
  await projectRow(session, CAVE).waitFor();
  await projectRow(session, SAMPLE.name).getByText('Open', { exact: true }).waitFor();
  await shoot(session, 'a145-manager-open');
  await projectRow(session, CAVE).click();
  await session.page.getByText(/This project is not open/).waitFor();
  await assetRow(session, SAMPLE.sprites[0]).waitFor();
  await assetRow(session, SAMPLE.sprites[0]).locator('img').waitFor({ timeout: POLL_MS });
  expect(await managerAssets(session).getByRole('button', { name: /^Actions for/ }).count()).toBe(0);
  await shoot(session, 'a145-manager-closed');
  await assetRow(session, SAMPLE.sprites[0]).scrollIntoViewIfNeeded();
  await shoot(session, 'a145-manager-closed-assets');
  await session.page.getByRole('button', { name: 'Open project', exact: true }).click();
  await projectRow(session, CAVE).getByText('Open', { exact: true }).waitFor({ timeout: POLL_MS });
  await managerAssets(session).getByRole('button', { name: /^Actions for/ }).first().waitFor();
};

const offersTheTwoWays = async (session: Session, place: string): Promise<void> => {
  const { sample } = await writeBoth(place);
  await openProjectAtInUi(session, sample, SAMPLE.name);
  await openHub(session, 'Project');
  await assetRow(session, SAMPLE.sprites[1]).click();
  const choice = session.page.getByRole('group', { name: `What to do with ${SAMPLE.sprites[1]}` });
  await choice.getByRole('button', { name: 'Open to edit' }).waitFor();
  await shoot(session, 'a145-manager-choice');
  await choice.getByRole('button', { name: 'Open in Asset settings' }).click();
  await session.page.getByRole('textbox', { name: 'Name' }).waitFor();
  expect(await session.page.getByRole('textbox', { name: 'Name' }).inputValue()).toBe(SAMPLE.sprites[1]);
  await shoot(session, 'a145-overview-sprite');
  await openHub(session, 'Project');
  await assetRow(session, SAMPLE.sprites[0]).click();
  await session.page.getByRole('group', { name: `What to do with ${SAMPLE.sprites[0]}` }).getByRole('button', { name: 'Open to edit' }).click();
  await expect.poll(() => openAssetTab(session, new RegExp(SAMPLE.sprites[0])).getAttribute('aria-selected'), { timeout: POLL_MS }).toBe('true');
};

const changesTheAsset = async (session: Session, place: string): Promise<void> => {
  const { sample } = await writeBoth(place);
  await openProjectAtInUi(session, sample, SAMPLE.name);
  await openHub(session, 'Project');
  await assetRow(session, SAMPLE.sprites[1]).click();
  await session.page.getByRole('button', { name: 'Open in Asset settings' }).click();
  const name = session.page.getByRole('textbox', { name: 'Name' });
  await name.fill('blob');
  await name.press('Enter');
  await session.page.getByText('blob', { exact: true }).first().waitFor();
  await session.page.getByRole('spinbutton', { name: 'Width' }).fill('20');
  await session.page.getByRole('button', { name: 'Resize', exact: true }).click();
  await session.page.getByText('20 by 16 pixels').first().waitFor({ timeout: POLL_MS });
  await session.page.getByRole('button', { name: 'Rotate clockwise' }).click();
  await session.page.getByText('16 by 20 pixels').first().waitFor({ timeout: POLL_MS });
  await shoot(session, 'a145-overview-changed');
};

describe('the project manager and the asset overview', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('lists every project, reads a closed one from the disk and opens it', () => inFreshPlace((place) => listsEveryProject(rig().session, place)));
});

describe('the asset a project lists', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('opens in the Asset settings or in an editor tab', () => inFreshPlace((place) => offersTheTwoWays(rig().session, place)));
});

describe('the overview of a sprite', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('renames, resizes and turns the sprite', () => inFreshPlace((place) => changesTheAsset(rig().session, place)));
});
