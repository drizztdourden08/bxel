/* @layer renderer-app @kind test */
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { APP_DIR, PROJECT_PARENT, TEMP_PREFIX } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { openAssetRow } from './support/open-asset-row';
import { openSession } from './support/open-session';
import { runMenu } from './support/run-menu';
import { shoot } from './support/shoot';
import { useRig } from './support/use-rig';
import { waitText } from './support/wait-text';

const SIZE = { width: 1280, height: 800 } as const;

const setWindow = (session: Session): Promise<void> =>
  session.app.evaluate(({ BrowserWindow }, size) => {
    BrowserWindow.getAllWindows()[0]?.setSize(size.width, size.height);
  }, SIZE);

const openRig = async (): Promise<{ session: Session }> => {
  const session = await openSession();
  const parent = join(APP_DIR, PROJECT_PARENT);
  await mkdir(parent, { recursive: true });
  const place = await mkdtemp(join(parent, TEMP_PREFIX));
  await answerDialogs(session, { open: place, save: null });
  await runMenu(session, [/^Help$/, /^Open the demo project$/]);
  await waitText(session, /Opened the project Bxel Demo/);
  await setWindow(session);
  await session.page.emulateMedia({ reducedMotion: 'reduce' });
  return { session: { ...session, close: () => session.close().then(() => rm(place, { recursive: true, force: true })) } };
};

describe('shots of the selection and transform area', () => {
  const rig = useRig(openRig);

  test('empty, selected, menu open, transform states', async () => {
    const { session } = rig();
    const { page } = session;
    await openAssetRow(session, 'hero');
    await page.waitForTimeout(800);
    await shoot(session, 'selection-1-empty');
    await page.getByRole('application', { name: /canvas/i }).first().focus();
    await page.keyboard.press('Control+a');
    await page.waitForTimeout(400);
    await shoot(session, 'selection-2-selected-all');
    await page.keyboard.press('Control+d');
    await page.keyboard.press('Control+Alt+d');
    await page.waitForTimeout(400);
    await shoot(session, 'selection-3-reselected');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('menuitem', { name: /^Edit$/ }).first().click();
    await page.waitForTimeout(400);
    await shoot(session, 'selection-4-edit-menu');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Control+t');
    await page.waitForTimeout(600);
    await shoot(session, 'selection-5-transform-open');
    const bar = page.getByRole('group', { name: 'Transform' });
    await bar.getByRole('spinbutton', { name: 'Angle', exact: true }).fill('30');
    await page.waitForTimeout(600);
    await shoot(session, 'selection-6-transform-rotated');
    const box = await bar.boundingBox();
    if (box) await page.screenshot({ path: join(process.env['BXEL_SHOTS'] ?? '.', 'selection-7-transform-bar-closeup.png'), clip: { x: box.x, y: box.y, width: Math.min(box.width, 1280), height: box.height + 80 } });
    await bar.getByRole('spinbutton', { name: 'Skew X', exact: true }).fill('20');
    await bar.getByRole('radio', { name: 'cleanEdge' }).click();
    await page.waitForTimeout(600);
    await shoot(session, 'selection-8-transform-skew-cleanedge');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Control+a');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('menuitem', { name: /^Edit$/ }).first().click();
    await page.getByRole('menuitem', { name: /^Saved selections/ }).first().click();
    await page.waitForTimeout(500);
    await shoot(session, 'selection-9-saved-selections');
    await page.keyboard.press('Escape');
  });

  test('sheet and map surfaces have no transform bar', async () => {
    const { session } = rig();
    await openAssetRow(session, 'party');
    await session.page.waitForTimeout(800);
    await shoot(session, 'selection-10-sheet-surface');
    await openAssetRow(session, 'meadow');
    await session.page.waitForTimeout(800);
    await shoot(session, 'selection-11-map-surface');
  });
});
