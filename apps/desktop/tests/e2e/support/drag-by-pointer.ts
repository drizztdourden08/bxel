/* @layer renderer-app @kind logic */
import type { Locator, Page } from 'playwright-core';

const STEPS = 12;

const dragByPointer = async (page: Page, from: Locator, to: Locator): Promise<void> => {
  const start = await from.boundingBox();
  const end = await to.boundingBox();
  if (!start || !end) throw new Error('The drag source or target is not on the page.');
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(start.x + start.width / 2 + 8, start.y + start.height / 2 + 8, { steps: 3 });
  await page.mouse.move(end.x + end.width / 2, end.y + end.height / 2, { steps: STEPS });
  await page.mouse.up();
};

export { dragByPointer };
