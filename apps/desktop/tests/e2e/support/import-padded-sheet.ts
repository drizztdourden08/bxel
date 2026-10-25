/* @layer renderer-app @kind logic */
import { answerDialogs } from './answer-dialogs';
import { SHORTCUT } from './e2e.constants';
import type { Session } from './e2e.type';
import { PADDED_SHEET } from './padded-sheet.constants';
import { writePaddedSheetPng } from './write-padded-sheet-png';

const GRID_FIELDS = [
  ['Cell size X', PADDED_SHEET.cell],
  ['Cell size Y', PADDED_SHEET.cell],
  ['Offset X', PADDED_SHEET.offset],
  ['Offset Y', PADDED_SHEET.offset],
  ['Spacing X', PADDED_SHEET.spacing],
  ['Spacing Y', PADDED_SHEET.spacing],
] as const;

const importPaddedSheet = async (session: Session, prefix: string): Promise<void> => {
  await answerDialogs(session, { open: await writePaddedSheetPng(session.dir), save: null });
  await session.page.keyboard.press(SHORTCUT.importImage);
  const dialog = session.page.getByRole('dialog', { name: /^Import image/ });
  await dialog.waitFor();
  await dialog.getByRole('radio', { name: 'Sheet' }).check();
  await dialog.getByRole('button', { name: 'Next: Colours' }).click();
  await dialog.getByText(/^Extract the best/).click();
  await dialog.getByRole('button', { name: 'Next: Slicing' }).click();
  for (const [name, value] of GRID_FIELDS) await dialog.getByRole('spinbutton', { name }).fill(String(value));
  await dialog.getByRole('textbox', { name: 'Names' }).fill(`${prefix}{n}`);
  await dialog.getByRole('button', { name: `Import ${PADDED_SHEET.count} sprites` }).click();
  await dialog.waitFor({ state: 'detached' });
};

export { importPaddedSheet };
