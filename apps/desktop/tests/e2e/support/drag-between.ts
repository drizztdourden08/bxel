/* @layer renderer-app @kind logic */
import type { Locator, Page } from 'playwright-core';

const dragBetween = async (page: Page, from: Locator, to: Locator): Promise<void> => {
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  const source = from.locator('[draggable="true"]').first();
  await source.dispatchEvent('dragstart', { dataTransfer });
  await to.dispatchEvent('dragenter', { dataTransfer });
  await to.dispatchEvent('dragover', { dataTransfer });
  await to.dispatchEvent('drop', { dataTransfer });
  await source.dispatchEvent('dragend', { dataTransfer });
};

export { dragBetween };
