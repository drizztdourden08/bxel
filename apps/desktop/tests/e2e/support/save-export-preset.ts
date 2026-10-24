/* @layer renderer-app @kind logic */
import type { Locator } from 'playwright-core';

const saveExportPreset = async (dialog: Locator, name: string): Promise<void> => {
  await dialog.getByRole('button', { name: 'Save preset...' }).click();
  await dialog.getByRole('textbox', { name: 'Preset name' }).fill(name);
  await dialog.getByRole('button', { name: 'Save', exact: true }).click();
  await dialog.getByRole('textbox', { name: 'Preset name' }).waitFor({ state: 'detached' });
};

export { saveExportPreset };
