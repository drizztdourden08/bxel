/* @layer renderer-app @kind test */
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { canvasMapper } from './support/canvas-mapper';
import { inFreshPlace } from './support/in-place';
import { openSession } from './support/open-session';
import { assetRow } from './support/panel-assets';
import { runMenu } from './support/run-menu';
import { waitText } from './support/wait-text';
import type { Session } from './support/e2e.type';

const SHOTS = 'X:/Bxel/.claude/plans/redesign/shots';

const snap = async (session: Session, name: string): Promise<void> => {
  await session.page.screenshot({ path: join(SHOTS, `drawing-${name}.png`) });
};

const sized = async (session: Session): Promise<void> => {
  await session.app.evaluate(({ BrowserWindow }) => {
    const window = BrowserWindow.getAllWindows()[0];
    window?.setContentSize(1280, 800);
  });
  await session.page.waitForTimeout(600);
};

const canvasOf = (session: Session) => session.page.getByRole('application', { name: 'Sprite canvas' });

const key = async (session: Session, keys: string): Promise<void> => {
  await canvasOf(session).focus();
  await session.page.keyboard.press(keys);
};

describe('screenshots of the drawing tools', () => {
  test('takes the shots', async () => {
    await mkdir(SHOTS, { recursive: true });
    await inFreshPlace(async (place) => {
      const session = await openSession();
      try {
        await sized(session);
        await answerDialogs(session, { open: place, save: null });
        await runMenu(session, [/^Help$/, /^Open the demo project$/]);
        await waitText(session, /Opened the project Bxel Demo/);
        await assetRow(session, 'slime').click();
        await session.page.waitForTimeout(1200);
        await snap(session, '01-pencil-rail-and-options');

        await key(session, 'u');
        await key(session, 'u');
        await snap(session, '02-rectangle-filled-options');

        await key(session, 'Shift+S');
        await key(session, 'Shift+S');
        await key(session, 'Shift+S');
        await key(session, 'Shift+S');
        await snap(session, '03-ink-dither-options');
        const ink = session.page.getByRole('button', { name: /Ink/ }).first();
        if (await ink.count()) {
          await ink.click();
          await session.page.waitForTimeout(300);
          await snap(session, '04-ink-menu-open');
          await session.page.keyboard.press('Escape');
        }

        const map = await canvasMapper(session, { width: 32, height: 32 });
        const { mouse } = session.page;
        await key(session, 'l');
        const a = map({ x: 4, y: 6 });
        const b = map({ x: 20, y: 14 });
        await mouse.move(a.x, a.y);
        await mouse.down();
        await session.page.keyboard.down('Shift');
        await mouse.move(b.x, b.y, { steps: 5 });
        await snap(session, '05-line-snap-ratio');
        await session.page.keyboard.up('Shift');
        await mouse.up();

        await key(session, 'Shift+D');
        for (const cell of [{ x: 6, y: 18 }, { x: 14, y: 16 }, { x: 18, y: 26 }]) {
          const at = map(cell);
          await mouse.click(at.x, at.y);
        }
        const hover = map({ x: 8, y: 28 });
        await mouse.move(hover.x, hover.y);
        await snap(session, '06-polygon-draft');
        await session.page.keyboard.press('Escape');

        await key(session, 'Shift+L');
        const c1 = map({ x: 3, y: 28 });
        const c2 = map({ x: 28, y: 28 });
        await mouse.move(c1.x, c1.y);
        await mouse.down();
        await mouse.move(c2.x, c2.y, { steps: 4 });
        await mouse.up();
        const bend = map({ x: 15, y: 18 });
        await mouse.move(bend.x, bend.y, { steps: 3 });
        await snap(session, '07-curve-bend');
        await mouse.click(bend.x, bend.y);

        await key(session, 'Shift+G');
        const g1 = map({ x: 16, y: 16 });
        const g2 = map({ x: 30, y: 4 });
        await mouse.move(g1.x, g1.y);
        await mouse.down();
        await mouse.move(g2.x, g2.y, { steps: 4 });
        await snap(session, '08-gradient-preview');
        await mouse.up();

        await key(session, 'Shift+B');
        const s1 = map({ x: 10, y: 10 });
        await mouse.move(s1.x, s1.y);
        await mouse.down();
        await session.page.waitForTimeout(700);
        await snap(session, '09-spray-held');
        await mouse.up();

        await key(session, 'Alt+R');
        await key(session, 'Alt+D');
        await key(session, 'b');
        const p1 = map({ x: 8, y: 20 });
        const p2 = map({ x: 12, y: 24 });
        await mouse.move(p1.x, p1.y);
        await mouse.down();
        await mouse.move(p2.x, p2.y, { steps: 4 });
        await snap(session, '10-symmetry-diagonal-and-turn');
        await mouse.up();

        await assetRow(session, 'meadow').click();
        await session.page.waitForTimeout(1200);
        await snap(session, '11-tilemap-tools');
      } finally {
        await session.close();
      }
    });
  });
});
