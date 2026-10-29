/* @layer renderer-app @kind logic */
import type { Locator, Page } from 'playwright-core';

type DroppedPng = { readonly name: string; readonly bytes: Uint8Array };

const dropFiles = async (page: Page, target: Locator, files: readonly DroppedPng[]): Promise<void> => {
  const payload = files.map((file) => ({ name: file.name, data: Array.from(file.bytes) }));
  const dataTransfer = await page.evaluateHandle((list) => {
    const transfer = new DataTransfer();
    for (const item of list) transfer.items.add(new File([new Uint8Array(item.data)], item.name, { type: 'image/png' }));
    return transfer;
  }, payload);
  await target.dispatchEvent('dragenter', { dataTransfer });
  await target.dispatchEvent('dragover', { dataTransfer });
  await target.dispatchEvent('drop', { dataTransfer });
};

export { dropFiles };
