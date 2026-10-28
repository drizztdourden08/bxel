/* @layer renderer-app @kind test */
import { describe, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { inFreshPlace } from './support/in-place';
import { openSession } from './support/open-session';
import { assetRow } from './support/panel-assets';
import { runMenu } from './support/run-menu';
import { shoot } from './support/shoot';
import { waitText } from './support/wait-text';

describe('review screenshots of the tools and the tool options', () => {
  test('takes the shots', async () => {
    await inFreshPlace(async (place) => {
      const session = await openSession();
      try {
      const { page } = session;
      await session.app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.setSize(1280, 800));
      await page.waitForTimeout(800);
      const tools = page.getByRole('toolbar', { name: 'Tools' });
      await shoot(session, 'tools-1-empty');
      await tools.screenshot({ path: `${process.env['BXEL_SHOTS']}/tools-1b-empty-rail-closeup.png` });
      await answerDialogs(session, { open: place, save: null });
      await runMenu(session, [/^Help$/, /^Open the demo project$/]);
      await waitText(session, /Opened the project Bxel Demo/);
      await assetRow(session, 'hero').click();
      await page.waitForTimeout(800);
      await shoot(session, 'tools-2-sprite-rail');
      await tools.screenshot({ path: `${process.env['BXEL_SHOTS']}/tools-2b-rail-closeup.png` });
      await page.getByRole('application', { name: 'Sprite canvas' }).focus();
      await page.keyboard.press('m');
      await page.keyboard.press('m');
      await page.keyboard.press('m');
      await tools.getByRole('button', { name: /^Select, Lasso/ }).click({ button: 'right' });
      await page.getByRole('menuitemradio', { name: 'Wand', exact: true }).waitFor();
      await shoot(session, 'tools-3-flyout-open');
      await page.getByRole('menuitem', { name: 'Tools panel...' }).evaluate((el) => (el as HTMLElement).click());
      for (const name of ['Palette', 'Layers', 'Timeline']) await page.getByRole('button', { name: `Close ${name}` }).click();
      await page.waitForTimeout(1500);
      await shoot(session, 'tools-4-learning-panel');
      await page.getByRole('application', { name: 'Sprite canvas' }).focus();
      await page.keyboard.press('b');
      await page.waitForTimeout(300);
      const bar = page.getByRole('toolbar', { name: 'Tool options' });
      await bar.screenshot({ path: `${process.env['BXEL_SHOTS']}/tools-5b-options-bar-closeup.png` });
      await shoot(session, 'tools-5-options-bar');
      await page.getByRole('button', { name: 'Close Tools' }).click();
      await bar.getByRole('button', { name: /^More options/ }).click();
      await page.waitForTimeout(600);
      await shoot(session, 'tools-6-options-inspector');
      await page.getByRole('button', { name: 'Save as preset' }).first().click();
      await page.getByRole('dialog').waitFor();
      await shoot(session, 'tools-7-preset-dialog');
      await page.keyboard.press('Escape');
      await bar.getByRole('button', { name: /^Pencil, / }).click();
      await page.waitForTimeout(400);
      await shoot(session, 'tools-8-preset-chip-menu');
      await page.keyboard.press('Escape');
      await page.keyboard.press('e');
      await page.keyboard.press('Alt+1');
      await assetRow(session, 'meadow').click();
      await page.waitForTimeout(1000);
      await shoot(session, 'tools-9-map-rail');
      } finally {
        await session.close();
      }
    });
  });
});
