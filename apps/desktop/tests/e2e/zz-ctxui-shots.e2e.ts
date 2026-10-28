/* @layer renderer-app @kind test */
import { mkdir } from 'node:fs/promises';
import { describe, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { inFreshPlace } from './support/in-place';
import { openAssetTab } from './support/open-asset-tab';
import { openSession } from './support/open-session';
import { assetRow } from './support/panel-assets';
import { runMenu } from './support/run-menu';
import { useRig } from './support/use-rig';
import type { Session } from './support/e2e.type';
import { waitText } from './support/wait-text';
import { writeBlocksPng } from './support/write-blocks-png';

const OUT = 'X:/Bxel/.claude/plans/redesign/shots';

const shot = async (session: Session, name: string): Promise<void> => {
  await session.page.waitForTimeout(500);
  await session.page.screenshot({ path: `${OUT}/contextual-ui-${name}.png` });
};

const open = async (session: Session, name: string, tab: RegExp): Promise<void> => {
  await assetRow(session, name).click();
  await openAssetTab(session, tab).waitFor();
};

const openMenu = async (session: Session, path: readonly RegExp[]): Promise<void> => {
  await session.page.getByRole('button', { name: 'Menu', exact: true }).click();
  for (const name of path) await session.page.getByRole('menuitem', { name }).first().hover();
  await session.page.waitForTimeout(400);
};

const closeMenu = async (session: Session): Promise<void> => {
  await session.page.keyboard.press('Escape');
  await session.page.keyboard.press('Escape');
  await session.page.keyboard.press('Escape');
};

describe('screenshots of the contextual chrome', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('takes them', async () => {
    const { session } = rig();
    await mkdir(OUT, { recursive: true });
    await session.app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().forEach((w) => w.setSize(1280, 800)));
    await inFreshPlace(async (place) => {
      await answerDialogs(session, { open: place, save: null });
      await runMenu(session, [/^Help$/, /^Open the demo project$/]);
      await waitText(session, /Opened the project Bxel Demo/);

      await open(session, 'slime', /slime/);
      await shot(session, '01-sprite');
      await session.page.keyboard.press('Control+a');
      await shot(session, '02-sprite-selection');
      await openMenu(session, [/^Edit$/]);
      await shot(session, '03-edit-menu-selection');
      await closeMenu(session);
      await openMenu(session, [/^Sprite$/]);
      await shot(session, '04-sprite-menu');
      await closeMenu(session);

      await open(session, 'hero', /hero/);
      await shot(session, '05-animation');
      await openMenu(session, [/^Animation$/]);
      await shot(session, '06-animation-menu');
      await closeMenu(session);

      await open(session, 'Demo 16', /Demo 16/);
      await shot(session, '07-palette-card');
      await session.page.getByRole('region', { name: 'Palette' }).screenshot({ path: `${OUT}/contextual-ui-08-palette-card-closeup.png` });

      await open(session, 'party', /party/);
      await shot(session, '09-sheet');

      await open(session, 'ground', /ground/);
      await shot(session, '10-tileset-edit-tile');
      await openMenu(session, [/^Tileset$/]);
      await shot(session, '11-tileset-menu');
      await closeMenu(session);

      await open(session, 'meadow', /meadow/);
      await shot(session, '12-tilemap-place');
      await openMenu(session, [/^Tilemap$/]);
      await shot(session, '13-tilemap-menu');
      await closeMenu(session);

      const png = await writeBlocksPng(session.dir);
      await answerDialogs(session, { open: png, save: null });
      await session.page.keyboard.press('Control+o');
      await openAssetTab(session, /blocks/).waitFor();
      await shot(session, '14-image-preview');
      await session.page.getByRole('region', { name: 'Image preview' }).screenshot({ path: `${OUT}/contextual-ui-15-image-preview-closeup.png` });
      await openMenu(session, [/^Image$/]);
      await shot(session, '16-image-menu');
      await closeMenu(session);

      const tabs = session.page.getByRole('tablist', { name: 'Open assets' });
      for (let count = await tabs.getByRole('tab').count(); count > 0; count = await tabs.getByRole('tab').count()) {
        await tabs.getByRole('tab').last().hover();
        await tabs.getByRole('button', { name: /^Close/ }).last().click();
        await session.page.waitForTimeout(300);
        if (count === (await tabs.getByRole('tab').count())) break;
      }
      await shot(session, '17-nothing-open');
      await openMenu(session, [/^Edit$/]);
      await shot(session, '18-edit-menu-nothing-open');
      await closeMenu(session);
    });
  });
});
