/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { dragByPointer } from './support/drag-by-pointer';
import type { Session } from './support/e2e.type';
import { inFreshPlace } from './support/in-place';
import { openDemo } from './support/open-demo';
import { openSession } from './support/open-session';
import { openSheetTab } from './support/open-sheet-tab';
import { assetRow } from './support/panel-assets';

const grid = (session: Session) => session.page.getByRole('grid', { name: 'Sprites', exact: true });

const checksDrop = async (session: Session, place: string): Promise<void> => {
  await openDemo(session, place);
  await openSheetTab(session, 'party');
  await grid(session).waitFor();
  const cells = grid(session).getByRole('gridcell');
  await expect.poll(() => cells.count()).toBe(2);
  await cells.first().click();
  await session.page.keyboard.press('Backspace');
  await expect.poll(() => cells.count()).toBe(1);
  await dragByPointer(session.page, assetRow(session, 'slime').locator('.project-thumb').first(), grid(session));
  await expect.poll(() => cells.count()).toBe(2);
};

describe('dropping a project asset on the sheet', () => {
  test('a sprite dragged from the Project panel is added to the sheet', async () => {
    const session = await openSession();
    try {
      await inFreshPlace((place) => checksDrop(session, place));
    } finally {
      await session.close();
    }
  });
});
