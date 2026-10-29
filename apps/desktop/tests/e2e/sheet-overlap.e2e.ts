/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import type { Session } from './support/e2e.type';
import { inFreshPlace } from './support/in-place';
import { openDemo } from './support/open-demo';
import { openSession } from './support/open-session';
import { openSheetTab } from './support/open-sheet-tab';

const grid = (session: Session) => session.page.getByRole('grid', { name: 'Sprites', exact: true });

const overlapButton = (session: Session) => session.page.getByRole('button', { name: /overlap/ });

const checksOverlap = async (session: Session, place: string): Promise<void> => {
  await openDemo(session, place);
  await openSheetTab(session, 'party');
  await grid(session).waitFor();
  await overlapButton(session).first().waitFor();
  await overlapButton(session).first().click();
  await expect.poll(() => overlapButton(session).count()).toBe(0);
  await session.page.keyboard.press('Control+z');
  await overlapButton(session).first().waitFor();
};

const checksSelectionAfterRemove = async (session: Session): Promise<void> => {
  const cells = grid(session).getByRole('gridcell');
  await cells.first().click();
  await session.page.keyboard.press('Control+a');
  await session.page.keyboard.press('Backspace');
  await expect.poll(() => cells.count()).toBe(0);
  const header = session.page.getByText(/0 entries/);
  await header.first().waitFor();
  expect(await header.first().textContent()).not.toContain('selected');
};

describe('the sheet manager with overlapping entries', () => {
  test('flags the overlap in the header, spreads the entries in rows and drops removed entries from the selection', async () => {
    const session = await openSession();
    try {
      await inFreshPlace(async (place) => {
        await checksOverlap(session, place);
        await checksSelectionAfterRemove(session);
      });
    } finally {
      await session.close();
    }
  });
});
