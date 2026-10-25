/* @layer renderer-app @kind test */
import { access, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { inFreshPlace } from './support/in-place';
import type { Session } from './support/e2e.type';
import { openSession } from './support/open-session';
import { assetRow } from './support/panel-assets';
import { runMenu } from './support/run-menu';
import { useRig } from './support/use-rig';
import { waitText } from './support/wait-text';

const DEMO_FOLDER = 'Bxel Demo';

const DEMO_SOURCE = join(import.meta.dirname, '../../demo', DEMO_FOLDER);

const filesUnder = async (root: string): Promise<string[]> =>
  (await readdir(root, { recursive: true, withFileTypes: true })).filter((entry) => entry.isFile()).map((entry) => join(entry.parentPath, entry.name).slice(root.length + 1).replaceAll('\\', '/')).sort();

const openDemo = async (session: Session, parent: string): Promise<void> => {
  await answerDialogs(session, { open: parent, save: null });
  await runMenu(session, [/^Help$/, /^Open the demo project$/]);
  await waitText(session, /Opened the project Bxel Demo/);
};

const copiesAndOpens = async (session: Session, place: string): Promise<void> => {
  await openDemo(session, place);
  const copy = join(place, DEMO_FOLDER);
  expect(await filesUnder(copy)).toEqual(await filesUnder(DEMO_SOURCE));
  for (const file of await filesUnder(DEMO_SOURCE)) expect(Buffer.compare(await readFile(join(copy, file)), await readFile(join(DEMO_SOURCE, file))), file).toBe(0);
  for (const name of ['hero', 'slime', 'party', 'ground', 'meadow']) await assetRow(session, name).waitFor();
  await assetRow(session, 'hero').click();
  const timeline = session.page.getByRole('region', { name: 'Timeline' });
  await timeline.getByText('3 frames, 1 layer').waitFor();
  await timeline.getByRole('button', { name: /^walk, Forward/ }).first().waitFor();
  await assetRow(session, 'party').click();
  await session.page.getByRole('tablist', { name: 'Open assets' }).getByRole('tab', { name: /party/ }).waitFor();
};

const keepsEditsOnSecondOpen = async (session: Session, place: string): Promise<void> => {
  await openDemo(session, place);
  await expect.poll(() => access(join(place, DEMO_FOLDER, `${DEMO_FOLDER}.bxproject`)).then(() => true, () => false), { timeout: 15000 }).toBe(true);
  const note = join(place, DEMO_FOLDER, 'my-note.txt');
  await writeFile(note, 'kept');
  await openDemo(session, place);
  expect(await readFile(note, 'utf8')).toBe('kept');
  await access(join(place, DEMO_FOLDER, `${DEMO_FOLDER}.bxproject`));
};

describe('the demo project in the Help menu', () => {
  const rig = useRig(async () => ({ session: await openSession() }));
  test('copies the bundled project into the chosen folder and opens every asset', () => inFreshPlace((place) => copiesAndOpens(rig().session, place)));
  test('opens the copy again without overwriting what the owner changed', () => inFreshPlace((place) => keepsEditsOnSecondOpen(rig().session, place)));
});
