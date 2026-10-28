/* @layer renderer-app @kind test */
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { APP_DIR, PROJECT_PARENT, TEMP_PREFIX } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { drag } from './support/drag-pointer';
import { expectAccessible } from './support/expect-accessible';
import { openAssetRow } from './support/open-asset-row';
import { openSession } from './support/open-session';
import { pickTransform } from './support/pick-transform';
import { runMenu } from './support/run-menu';
import { centreOf } from './support/ruler-centre';
import type { RulerName } from './support/ruler-centre';
import { shoot } from './support/shoot';
import { useRig } from './support/use-rig';
import { waitText } from './support/wait-text';
import { zoomOf } from './support/zoom-of';

const SIZE = { width: 1280, height: 800 } as const;

const header = (session: Session) => session.page.getByRole('navigation', { name: 'Stage path' });

const widget = (session: Session) => session.page.getByRole('region', { name: 'View' });

const setWindow = (session: Session): Promise<void> =>
  session.app.evaluate(({ BrowserWindow }, size) => {
    BrowserWindow.getAllWindows()[0]?.setSize(size.width, size.height);
  }, SIZE);

const openDemo = async (session: Session, place: string): Promise<void> => {
  await answerDialogs(session, { open: place, save: null });
  await runMenu(session, [/^Help$/, /^Open the demo project$/]);
  await waitText(session, /Opened the project Bxel Demo/);
  await setWindow(session);
};

const showViewWidget = async (session: Session): Promise<void> => {
  await session.page.getByRole('button', { name: 'Menu', exact: true }).click();
  await session.page.getByRole('menuitem', { name: /^Widgets$/ }).first().click();
  await session.page.locator('[role^="menuitem"]').filter({ hasText: /^View$/ }).last().click();
  await session.page.mouse.click(640, 20);
  await widget(session).waitFor();
};

const openDemoRig = async (): Promise<{ session: Session }> => {
  const session = await openSession();
  const parent = join(APP_DIR, PROJECT_PARENT);
  await mkdir(parent, { recursive: true });
  const place = await mkdtemp(join(parent, TEMP_PREFIX));
  await openDemo(session, place);
  await showViewWidget(session);
  await session.page.emulateMedia({ reducedMotion: 'reduce' });
  return { session: { ...session, close: () => session.close().then(() => rm(place, { recursive: true, force: true })) } };
};

const canvasBox = async (session: Session) => {
  const box = await session.page.locator('[role="application"] .pixel-viewport__canvas').first().boundingBox();
  if (!box) throw new Error('the canvas has no box');
  return box;
};

const clearEnabled = async (session: Session, ruler: RulerName): Promise<boolean> => {
  await session.page.getByRole('button', { name: ruler }).focus();
  await session.page.keyboard.press('Enter');
  const clear = session.page.getByRole('menu').getByRole('menuitem', { name: 'Clear guides' });
  await clear.waitFor();
  const enabled = !(await clear.isDisabled());
  await session.page.keyboard.press('Escape');
  return enabled;
};

const pullGuide = async (session: Session, ruler: RulerName): Promise<void> => {
  const box = await canvasBox(session);
  await drag(session, await centreOf(session, ruler), { x: box.x + box.width * 0.4, y: box.y + box.height * 0.4 });
  expect(await clearEnabled(session, ruler)).toBe(true);
};

const focusCanvas = (session: Session, label: string) => session.page.getByRole('application', { name: label }).focus();

describe('the canvas: View widget, stage header and floating Apply bar', () => {
  const rig = useRig(openDemoRig);

  test('the stage header names the sprite and the View widget shows its sections', async () => {
    const { session } = rig();
    await openAssetRow(session, 'slime');
    await header(session).getByText('slime').first().waitFor();
    for (const name of ['Navigator', 'Zoom', 'Overlays', 'Background']) await widget(session).getByText(name, { exact: true }).first().waitFor();
    expect(await header(session).getByRole('button').count()).toBeGreaterThan(0);
    const caption = await widget(session).locator('.navigator__caption').boundingBox();
    expect(caption?.height ?? 99).toBeLessThan(24);
    await widget(session).getByText(/16 x 16 px, \d+% shown/).waitFor();
    await session.page.mouse.move(640, 300);
    await shoot(session, 'canvas-1-sprite');
    await expectAccessible(session, 'sprite with the View widget');
  });

  test('a typed zoom, a preset and a digit key change the canvas zoom, and 25 percent is reachable', async () => {
    const { session } = rig();
    const field = widget(session).getByRole('textbox', { name: 'Zoom percent' });
    await field.fill('800');
    await field.press('Enter');
    await expect.poll(() => zoomOf(session)).toBe(8);
    await widget(session).getByRole('button', { name: '25%', exact: true }).click();
    await expect.poll(() => zoomOf(session)).toBe(0.25);
    await focusCanvas(session, 'Sprite canvas');
    await session.page.keyboard.press('2');
    await expect.poll(() => zoomOf(session)).toBe(2);
    await widget(session).getByRole('button', { name: 'Fit', exact: true }).click();
    await shoot(session, 'canvas-2-zoom-field');
  });

  test('a transform previews in a floating Apply bar and the canvas does not move', async () => {
    const { session } = rig();
    await focusCanvas(session, 'Sprite canvas');
    await session.page.keyboard.press('Control+a');
    const before = await canvasBox(session);
    await pickTransform(session, 'Flip horizontal');
    const bar = session.page.getByRole('alertdialog', { name: 'Apply bar' });
    await bar.waitFor();
    expect(await canvasBox(session)).toEqual(before);
    const box = await bar.boundingBox();
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(SIZE.width);
    await shoot(session, 'canvas-3-apply-bar');
    await expectAccessible(session, 'floating Apply bar');
    await bar.getByRole('button', { name: 'Cancel' }).click();
    await bar.waitFor({ state: 'detached' });
  });
});

describe('the canvas: animation header and the parity of sheet and map', () => {
  const rig = useRig(openDemoRig);

  test('the animation frame header names the animation, the frame and the sprite', async () => {
    const { session } = rig();
    await openAssetRow(session, 'hero');
    await header(session).getByText(/Frame 1 of 3/).waitFor();
    await shoot(session, 'canvas-5-animation');
  });

  test('a sheet has rulers and takes a guide from the ruler', async () => {
    const { session } = rig();
    await openAssetRow(session, 'party');
    await session.page.getByRole('application', { name: 'Sheet canvas' }).waitFor();
    await shoot(session, 'canvas-6a-sheet');
    await pullGuide(session, 'Vertical ruler');
    await session.page.getByRole('application', { name: 'Sheet canvas' }).waitFor();
    await shoot(session, 'canvas-6-sheet-guides');
    await expectAccessible(session, 'sheet with rulers and a guide');
  });

  test('a map has rulers, takes a guide from the ruler and shows its overlays in the View widget', async () => {
    const { session } = rig();
    await openAssetRow(session, 'meadow');
    await session.page.getByRole('application', { name: 'Tilemap canvas' }).waitFor();
    await widget(session).getByText('Collision shapes').first().waitFor();
    await pullGuide(session, 'Horizontal ruler');
    await shoot(session, 'canvas-7-map-guides');
    await focusCanvas(session, 'Tilemap canvas');
    await session.page.keyboard.press('Control+z');
    expect(await clearEnabled(session, 'Horizontal ruler')).toBe(false);
    await focusCanvas(session, 'Tilemap canvas');
    await session.page.keyboard.press('Control+y');
    expect(await clearEnabled(session, 'Horizontal ruler')).toBe(true);
    await expectAccessible(session, 'map with rulers and a guide');
  });
});
