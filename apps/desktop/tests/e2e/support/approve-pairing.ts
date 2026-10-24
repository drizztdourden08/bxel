/* @layer renderer-app @kind logic */
import type { Page } from 'playwright-core';

const approvePairing = async (page: Page, choice: 'Allow read only' | 'Allow editing'): Promise<void> => {
  const dialog = page.getByRole('dialog', { name: 'A program wants to use Bxel' });
  await dialog.waitFor();
  await dialog.getByText(choice, { exact: true }).click();
  await dialog.getByRole('button', { name: 'Allow', exact: true }).click();
};

export { approvePairing };
