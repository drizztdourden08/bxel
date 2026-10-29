/* @layer renderer-app @kind logic */
import type { Locator, Page } from 'playwright-core';

const STEPS = 12;

type Box = { x: number; y: number; width: number; height: number };

const visibleCenter = async (page: Page, box: Box): Promise<{ x: number; y: number }> => {
  const size = await page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const left = Math.max(box.x, 0);
  const top = Math.max(box.y, 0);
  const right = Math.min(box.x + box.width, size.width);
  const bottom = Math.min(box.y + box.height, size.height);
  return { x: (left + right) / 2, y: (top + bottom) / 2 };
};

const dragByPointer = async (page: Page, from: Locator, to: Locator): Promise<void> => {
  await to.scrollIntoViewIfNeeded();
  await from.scrollIntoViewIfNeeded();
  const start = await from.boundingBox();
  const end = await to.boundingBox();
  if (!start || !end) throw new Error('The drag source or target is not on the page.');
  const target = await visibleCenter(page, end);
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(start.x + start.width / 2 + 8, start.y + start.height / 2 + 8, { steps: 3 });
  await page.mouse.move(target.x, target.y, { steps: STEPS });
  await page.mouse.up();
};

export { dragByPointer };
