/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const swatchOf = (session: Session, index: number) =>
  session.page
    .getByRole('region', { name: 'Palette' })
    .getByRole('listbox', { name: 'Palette swatches' })
    .getByRole('option', { name: new RegExp(`^Swatch ${index},`) });

const makeRamp = async (session: Session, slots: readonly number[]): Promise<void> => {
  const [first = 1, ...rest] = slots;
  await swatchOf(session, first).click();
  for (const slot of rest) await swatchOf(session, slot).click({ modifiers: ['Control'] });
  await session.page.keyboard.press('Insert');
  await swatchOf(session, rest[0] ?? first).focus();
  await session.page.keyboard.press('Shift+F10');
  await session.page.getByRole('menuitem', { name: /^Make ramp$/ }).click();
};

export { makeRamp };
