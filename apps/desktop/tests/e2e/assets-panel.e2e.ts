/* @layer renderer-app @kind test */
import { access, mkdir, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test, vi } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { answerOpenInOrder } from './support/answer-open-in-order';
import { buildManyAssets } from './support/build-many-assets';
import { buildSampleArtwork } from './support/build-sample-artwork';
import { POLL_MS, SHORTCUT } from './support/e2e.constants';
import { inFreshPlace } from './support/in-place';
import type { Session } from './support/e2e.type';
import { MANY } from './support/many.constants';
import { openAssetTab } from './support/open-asset-tab';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { assetList, assetRow, chip } from './support/panel-assets';
import { runMenu } from './support/run-menu';
import { SAMPLE } from './support/sample.constants';
import { useRig } from './support/use-rig';
import { waitText } from './support/wait-text';
import { writeSampleProject } from './support/write-sample-project';

const countsOnChips = async (session: Session): Promise<void> => {
  await chip(session, /^All 100$/).waitFor();
  await chip(session, new RegExp(`^Sprites ${MANY.sprites}$`)).waitFor();
  await chip(session, new RegExp(`^Sheets ${MANY.sheets}$`)).waitFor();
  await chip(session, /^Palettes 1$/).waitFor();
  await chip(session, /^Tilemaps 0$/).waitFor();
  await chip(session, /^Images 0$/).waitFor();
};

const narrowsByChip = async (session: Session): Promise<void> => {
  await chip(session, /^Sprites/).click();
  await assetRow(session, 's001').waitFor();
  expect(await assetList(session).getByText('sh001').count()).toBe(0);
  await chip(session, /^Sheets/).click();
  await assetRow(session, 'sh001').waitFor();
  expect(await assetList(session).getByText('s001', { exact: true }).count()).toBe(0);
  await chip(session, /^Palettes/).click();
  await assetRow(session, 'Main').waitFor();
  await chip(session, /^All/).click();
};

const searches = async (session: Session): Promise<void> => {
  const box = session.page.getByRole('searchbox', { name: 'Search the project' });
  await box.fill('sh01');
  await chip(session, /^All 10$/).waitFor();
  await box.fill('');
  await chip(session, /^All 100$/).waitFor();
};

const filtersBySheetsThatUseASprite = async (session: Session): Promise<void> => {
  await session.page.getByRole('searchbox', { name: 'Search the project' }).fill('s002');
  await assetRow(session, 's002').getByRole('button', { name: 'Used by 2 sheets' }).click();
  await session.page.getByText('Sheets that use s002').waitFor();
  await assetRow(session, 'sh001').waitFor();
  await assetRow(session, 'sh002').waitFor();
  await session.page.getByRole('button', { name: 'Show all' }).click();
  await session.page.getByRole('searchbox', { name: 'Search the project' }).fill('');
};

const rowMenu = async (session: Session): Promise<void> => {
  await assetRow(session, 's003').click({ button: 'right' });
  for (const item of ['Open', 'Rename', 'Reveal in folder', 'Duplicate', 'Move to trash']) {
    await session.page.getByRole('menuitem', { name: item, exact: true }).waitFor();
  }
  await session.page.getByRole('menuitem', { name: 'Duplicate', exact: true }).click();
  await chip(session, new RegExp(`^Sprites ${MANY.sprites + 1}$`)).waitFor();
  await session.page.getByRole('button', { name: 'Actions for s004' }).click();
  await session.page.getByRole('menuitem', { name: 'Move to trash', exact: true }).click();
  await chip(session, new RegExp(`^Sprites ${MANY.sprites}$`)).waitFor();
};

const opensATab = async (session: Session): Promise<void> => {
  await assetRow(session, 's005').click();
  await openAssetTab(session, /s005/).waitFor();
};

const bytesOf = async (root: string, base = root): Promise<Map<string, Buffer>> => {
  const found = new Map<string, Buffer>();
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) for (const [key, bytes] of await bytesOf(path, base)) found.set(key, bytes);
    else if (!entry.name.endsWith('.bxproject')) found.set(path.slice(base.length), await readFile(path));
  }
  return found;
};

const packsAndUnpacks = async (session: Session, place: string): Promise<void> => {
  const root = join(place, SAMPLE.name);
  await writeSampleProject(root, buildSampleArtwork(), SAMPLE.name);
  await openProjectAtInUi(session, root, SAMPLE.name);
  const packed = join(place, 'share', `${SAMPLE.name}.bxproject`);
  await mkdir(join(place, 'share'), { recursive: true });
  await answerDialogs(session, { open: join(place, 'share'), save: packed });
  await runMenu(session, [/^Project/, /^Pack project/]);
  await waitText(session, /Packed the project with 5 assets/);
  const destination = join(place, 'out');
  await mkdir(destination, { recursive: true });
  await answerOpenInOrder(session, [packed, destination]);
  await session.page.keyboard.press(SHORTCUT.open);
  await vi.waitFor(() => access(join(destination, SAMPLE.name, `${SAMPLE.name}.bxproject`)), { timeout: POLL_MS });
  const copy = await bytesOf(join(destination, SAMPLE.name));
  const original = await bytesOf(root);
  expect([...copy.keys()].sort()).toEqual([...original.keys()].sort());
  for (const [key, bytes] of original) expect(Buffer.compare(copy.get(key) ?? Buffer.alloc(0), bytes)).toBe(0);
};

describe('check 10: the Assets view, Pack and Unpack', () => {
  const rig = useRig(async () => ({ session: await openSession() }));
  test('lists a project of 100 assets, narrows by kind, search and used by, and acts on a row', () =>
    inFreshPlace(async (place) => {
      const { session } = rig();
      const root = join(place, MANY.name);
      await writeSampleProject(root, buildManyAssets(), MANY.name);
      await openProjectAtInUi(session, root, MANY.name);
      await countsOnChips(session);
      await narrowsByChip(session);
      await searches(session);
      await filtersBySheetsThatUseASprite(session);
      await rowMenu(session);
      await opensATab(session);
    }));
});

describe('check 10: Pack and Unpack', () => {
  const rig = useRig(async () => ({ session: await openSession() }));
  test('packs a project into one file and unpacks it into an identical project', () => inFreshPlace((place) => packsAndUnpacks(rig().session, place)));
});
