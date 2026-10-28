/* @layer renderer-app @kind test */
import { mkdir } from 'node:fs/promises';
import { describe, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { frameButton, framesOf, openAnimationTab, openFacing, timelineOf } from './support/animation-ui';
import { inFreshPlace } from './support/in-place';
import type { Session } from './support/e2e.type';
import { openSession } from './support/open-session';
import { assetRow } from './support/panel-assets';
import { runMenu } from './support/run-menu';
import { waitText } from './support/wait-text';

const FOLDER = process.env['BXEL_SHOTS'] ?? '';

const shot = async (session: Session, name: string): Promise<void> => {
  if (FOLDER === '') return;
  await session.page.screenshot({ path: `${FOLDER}/timeline-${name}.png` });
};

const clip = async (session: Session, name: string, selector: string): Promise<void> => {
  if (FOLDER === '') return;
  await session.page.locator(selector).first().screenshot({ path: `${FOLDER}/timeline-${name}.png` });
};

const run = async (session: Session, place: string): Promise<void> => {
  await mkdir(FOLDER, { recursive: true });
  await session.app.evaluate(({ BrowserWindow }) => {
    const window = BrowserWindow.getAllWindows()[0];
    window?.setContentSize(1280, 800);
  });
  await answerDialogs(session, { open: place, save: null });
  await runMenu(session, [/^Help$/, /^Open the demo project$/]);
  await waitText(session, /Opened the project Bxel Demo/);
  const timeline = timelineOf(session);
  await assetRow(session, 'hero').click();
  await framesOf(session).waitFor();
  await shot(session, '1-sprite-empty-or-animation');
  await assetRow(session, 'slime').click();
  await shot(session, '2-other-asset');
  await openAnimationTab(session, 'hero');
  await frameButton(session, 1).click();
  await shot(session, '3-animation-default');
  await frameButton(session, 3).click({ modifiers: ['Shift'] });
  await shot(session, '4-picked-frames');
  await timeline.getByRole('button', { name: 'Play options' }).click();
  await shot(session, '5-play-menu');
  await session.page.keyboard.press('Escape');
  await timeline.getByRole('button', { name: 'Onion skin settings' }).click();
  await shot(session, '6-onion-popover');
  await session.page.keyboard.press('Escape');
  await timeline.getByRole('button', { name: 'Onion skin', exact: true }).click();
  await frameButton(session, 2).click();
  await shot(session, '7-onion-on');
  await frameButton(session, 2).click({ button: 'right' });
  await shot(session, '8-frame-menu');
  await session.page.keyboard.press('Escape');
  await timeline.getByRole('button', { name: 'More timeline actions' }).click();
  await shot(session, '9-more-menu');
  await session.page.keyboard.press('Escape');
  await timeline.getByRole('button', { name: /^walk, forward/ }).first().dblclick();
  await shot(session, '10-tag-popover');
  await session.page.keyboard.press('Escape');
  await timeline.getByRole('button', { name: 'Larger frames' }).click();
  await shot(session, '11-zoom-larger');
  await timeline.getByRole('button', { name: 'Fit', exact: true }).click();
  await clip(session, '12-closeup-header', '.timeline__header');
  await clip(session, '13-closeup-body', '.timeline__body');
  await clip(session, '14-closeup-footer', '.timeline__footer');
  await session.page.keyboard.press('t');
  await shot(session, '15-time-mode');
  await openFacing(session).catch(() => undefined);
};

describe('timeline screenshots', () => {
  test('takes the review shots', async () => {
    await inFreshPlace(async (place) => {
      const session = await openSession(['--no-focus', '--muted']);
      try {
        await run(session, place);
      } finally {
        await session.close();
      }
    });
  }, 240000);
});
