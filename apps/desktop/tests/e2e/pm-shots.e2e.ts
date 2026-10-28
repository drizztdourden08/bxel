/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { buildGalleryArtwork } from './support/build-gallery-artwork';
import type { Session } from './support/e2e.type';
import { GALLERY } from './support/gallery.constants';
import { inFreshPlace } from './support/in-place';
import { openHub } from './support/open-hub';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { runMenu } from './support/run-menu';
import { shoot } from './support/shoot';
import { useRig } from './support/use-rig';
import { waitText } from './support/wait-text';
import { writeSampleProject } from './support/write-sample-project';

const shot = (session: Session, n: number, state: string): Promise<void> => shoot(session, `project-mgmt-${n}-${state}`);

const sizeWindow = (session: Session): Promise<void> =>
  session.app.evaluate(({ BrowserWindow }) => {
    const [window] = BrowserWindow.getAllWindows();
    window?.setSize(1280, 800);
  });

const search = (session: Session, text: string) => session.page.getByLabel('Search the project').fill(text);

const demo = async (session: Session, place: string): Promise<void> => {
  const { page } = session;
  await sizeWindow(session);
  await answerDialogs(session, { open: place, save: null });
  await runMenu(session, [/^Help$/, /^Open the demo project$/]);
  await waitText(session, /Opened the project Bxel Demo/);
  await page.keyboard.press('Alt+Enter');
  await page.getByRole('textbox', { name: 'Name' }).waitFor();
  await shot(session, 1, 'properties-following-tab');
  await page.keyboard.press('Escape');
  await openHub(session, 'Project');
  await page.getByRole('toolbar', { name: 'Browse' }).waitFor();
  await page.waitForTimeout(800);
  await shot(session, 2, 'browse-grid-roots');
  await page.getByRole('gridcell', { name: 'sprites', exact: true }).first().dblclick();
  await page.waitForTimeout(1200);
  await shoot(session, 'dbg-after-dblclick');
  await page.getByRole('gridcell', { name: 'hero', exact: true }).first().click();
  await page.waitForTimeout(500);
  await shot(session, 3, 'browse-grid-selected');
  await page.getByRole('gridcell', { name: 'hero', exact: true }).first().click({ button: 'right' });
  await page.getByRole('menu').first().waitFor();
  await shot(session, 4, 'browse-context-menu');
  await page.keyboard.press('Escape');
  await page.getByRole('radio', { name: 'List' }).click();
  await page.waitForTimeout(500);
  await shot(session, 5, 'browse-list');
  await page.getByRole('radio', { name: 'Columns' }).click();
  await page.waitForTimeout(500);
  await shot(session, 6, 'browse-columns');
  await page.getByRole('radio', { name: 'Grid' }).click();
  await search(session, 'kind:sprite is:unused');
  await page.waitForTimeout(500);
  await shot(session, 7, 'browse-search-tokens');
  await search(session, 'zzzz');
  await page.waitForTimeout(300);
  await shot(session, 8, 'browse-nothing-matches');
  await search(session, '');
  await page.getByRole('gridcell', { name: 'hero', exact: true }).first().click();
  await page.getByRole('complementary', { name: 'Preview' }).getByRole('button', { name: 'Properties', exact: true }).click();
  await page.getByRole('textbox', { name: 'Name' }).waitFor();
  await page.waitForTimeout(500);
  await shot(session, 9, 'properties-pinned-from-browse');
  await page.keyboard.press('Escape');
  await page.keyboard.press('Control+,');
  await page.getByText('Window mode', { exact: true }).waitFor();
  await page.waitForTimeout(400);
  await shot(session, 10, 'options-window');
  await page.keyboard.press('Escape');
};

const gallery = async (session: Session, place: string): Promise<void> => {
  const { page } = session;
  const root = join(place, GALLERY.project);
  await sizeWindow(session);
  await writeSampleProject(root, buildGalleryArtwork(), GALLERY.project);
  await openProjectAtInUi(session, root, GALLERY.project);
  await openHub(session, 'Project');
  await search(session, 'kind:animation');
  await page.getByRole('gridcell').first().click();
  await page.waitForTimeout(1200);
  await shoot(session, 'dbg-after-animation-click');
  await page.getByRole('complementary', { name: 'Preview' }).getByRole('button', { name: 'Play', exact: true }).click();
  await page.waitForTimeout(250);
  await shot(session, 11, 'preview-animation-playing');
  await page.getByRole('complementary', { name: 'Preview' }).getByRole('button', { name: 'Pause', exact: true }).click();
  await search(session, 'kind:palette');
  await page.getByRole('gridcell').first().click();
  await page.waitForTimeout(400);
  await shot(session, 12, 'preview-palette');
  await search(session, 'kind:tilemap');
  await page.getByRole('gridcell').first().click();
  await page.waitForTimeout(400);
  await shot(session, 13, 'preview-tilemap');
  await search(session, '');
  await page.keyboard.press('Escape');
  await page.keyboard.press('Alt+Enter');
  await page.getByRole('textbox', { name: 'Name' }).waitFor();
  await page.waitForTimeout(400);
  await shot(session, 14, 'properties-sprite-follow');
};

describe('review shots of the project windows', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('the demo project', () => inFreshPlace((place) => demo(rig().session, place)));
});

describe('review shots of the gallery project', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('the gallery project', () => inFreshPlace((place) => gallery(rig().session, place)));
});
