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

const tileset = (session: Session) => session.page.getByRole('region', { name: 'Tileset' });

const cells = (session: Session) => tileset(session).getByRole('gridcell', { name: /^Tile \d/ });

const modes = (session: Session) => tileset(session).getByRole('radiogroup', { name: 'Tileset mode' });

const openRig = async (): Promise<{ session: Session }> => {
  const session = await openSession();
  const parent = join(APP_DIR, PROJECT_PARENT);
  await mkdir(parent, { recursive: true });
  const place = await mkdtemp(join(parent, TEMP_PREFIX));
  await answerDialogs(session, { open: place, save: null });
  await runMenu(session, [/^Help$/, /^Open the demo project$/]);
  await waitText(session, /Opened the project Bxel Demo/);
  await session.app.evaluate(({ BrowserWindow }, size) => {
    BrowserWindow.getAllWindows()[0]?.setSize(size.width, size.height);
  }, SIZE);
  await session.page.emulateMedia({ reducedMotion: 'reduce' });
  return { session: { ...session, close: () => session.close().then(() => rm(place, { recursive: true, force: true })) } };
};

describe('tileset shots', () => {
  const rig = useRig(openRig);

  test('shoots the tileset tab and the map tab', async () => {
    const { session } = rig();
    await openAssetRow(session, 'ground');
    await cells(session).first().waitFor();
    await shoot(session, 'tileset-1-tileset-tab');
    await cells(session).first().click();
    await shoot(session, 'tileset-2-selected');
    await cells(session).nth(2).click({ modifiers: ['Shift'] });
    await shoot(session, 'tileset-3-block-stamp');
    await cells(session).first().click();
    await cells(session).nth(1).click({ modifiers: ['Control'] });
    await shoot(session, 'tileset-4-scatter-multi');
    await modes(session).getByRole('radio', { name: /Collision/ }).click();
    await tileset(session).getByRole('radio', { name: 'Paint full' }).click();
    await cells(session).first().hover();
    await shoot(session, 'tileset-5-collision-mode');
    await tileset(session).getByRole('radio', { name: 'Select' }).click();
    await cells(session).first().click();
    await shoot(session, 'tileset-6-collision-inspector');
    await modes(session).getByRole('radio', { name: /Data/ }).click();
    await shoot(session, 'tileset-7-data-empty');
    await modes(session).getByRole('radio', { name: /Animation/ }).click();
    await shoot(session, 'tileset-8-animation-mode');
    await modes(session).getByRole('radio', { name: /Terrain/ }).click();
    await shoot(session, 'tileset-9-terrain-mode');
    await modes(session).getByRole('radio', { name: /Tiles/ }).click();
    await cells(session).first().click({ button: 'right' });
    await shoot(session, 'tileset-10-menu');
    await session.page.keyboard.press('Escape');
    await openAssetRow(session, 'meadow');
    await session.page.getByRole('application', { name: 'Tilemap canvas' }).waitFor();
    await shoot(session, 'tileset-11-map-tab');
  });
});
