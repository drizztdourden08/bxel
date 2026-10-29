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
import { assetRow, filterChip, projectTree } from './support/panel-assets';
import { runMenu } from './support/run-menu';
import { SAMPLE } from './support/sample.constants';
import { useRig } from './support/use-rig';
import { waitText } from './support/wait-text';
import { writeSampleProject } from './support/write-sample-project';

const searchBox = (session: Session) => session.page.getByRole('searchbox', { name: 'Search the project' });

const shown = (session: Session, text: RegExp) => session.page.getByText(text);

const narrowsByKind = async (session: Session): Promise<void> => {
  await searchBox(session).fill('kind:sprite ');
  await filterChip(session, 'kind:sprite').waitFor();
  await shown(session, new RegExp(`^${MANY.sprites} of ${MANY.sprites + MANY.sheets + 1} shown$`)).waitFor();
  await assetRow(session, 's001').waitFor();
  expect(await projectTree(session).getByText('sh001', { exact: true }).count()).toBe(0);
  await session.page.getByRole('button', { name: 'Clear filters' }).click();
  await searchBox(session).fill('kind:palette ');
  await assetRow(session, 'Main').waitFor();
  await session.page.getByRole('button', { name: 'Clear filters' }).click();
};

const searches = async (session: Session): Promise<void> => {
  await searchBox(session).fill('sh01');
  await shown(session, /^10 of 100 shown$/).waitFor();
  await searchBox(session).fill('');
  await shown(session, /of 100 shown/).waitFor({ state: 'detached' });
};

const filtersByTheAssetsThatUseASprite = async (session: Session): Promise<void> => {
  await searchBox(session).fill('s002');
  await assetRow(session, 's002').getByRole('button', { name: /Used by 2 assets/ }).click();
  await filterChip(session, 'uses:s002').waitFor();
  await assetRow(session, 'sh001').waitFor();
  await assetRow(session, 'sh002').waitFor();
  await session.page.getByRole('button', { name: 'Clear filters' }).click();
  await searchBox(session).fill('');
};

const rowMenu = async (session: Session): Promise<void> => {
  await searchBox(session).fill('s003');
  await assetRow(session, 's003').click({ button: 'right' });
  for (const item of ['Open', 'Rename', 'Reveal in folder', 'Duplicate', 'Move to trash']) {
    await session.page.getByRole('menuitem', { name: item, exact: true }).waitFor();
  }
  await session.page.getByRole('menuitem', { name: 'Duplicate', exact: true }).click();
  await assetRow(session, 's003 copy').waitFor();
  await searchBox(session).fill('s004');
  await assetRow(session, 's004').hover();
  await session.page.getByRole('button', { name: 'Actions for s004' }).click();
  await session.page.getByRole('menuitem', { name: 'Move to trash', exact: true }).click();
  await assetRow(session, 's004').waitFor({ state: 'detached' });
  await searchBox(session).fill('');
};

const sharesTheMenuWithTheButton = async (session: Session): Promise<void> => {
  await searchBox(session).fill('s006');
  const names = async (): Promise<string[]> => session.page.getByRole('menuitem').allInnerTexts();
  await assetRow(session, 's006').click({ button: 'right' });
  const fromRightClick = await names();
  await session.page.keyboard.press('Escape');
  await assetRow(session, 's006').hover();
  await session.page.getByRole('button', { name: 'Actions for s006' }).click();
  expect(await names()).toEqual(fromRightClick);
  await session.page.keyboard.press('Escape');
  await searchBox(session).fill('');
};

const opensATab = async (session: Session): Promise<void> => {
  await searchBox(session).fill('s005');
  await assetRow(session, 's005').click();
  expect(await session.page.getByRole('tab', { name: /s005/ }).count()).toBe(0);
  await assetRow(session, 's005').dblclick();
  await openAssetTab(session, /s005/).waitFor();
  await searchBox(session).fill('');
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
  test('lists a project of 100 assets, narrows by kind token, search and used by, and acts on a row', () =>
    inFreshPlace(async (place) => {
      const { session } = rig();
      const root = join(place, MANY.name);
      await writeSampleProject(root, buildManyAssets(), MANY.name);
      await openProjectAtInUi(session, root, MANY.name);
      await narrowsByKind(session);
      await searches(session);
      await filtersByTheAssetsThatUseASprite(session);
      await rowMenu(session);
      await sharesTheMenuWithTheButton(session);
      await opensATab(session);
    }));
});

describe('check 10: Pack and Unpack', () => {
  const rig = useRig(async () => ({ session: await openSession() }));
  test('packs a project into one file and unpacks it into an identical project', () => inFreshPlace((place) => packsAndUnpacks(rig().session, place)));
});
