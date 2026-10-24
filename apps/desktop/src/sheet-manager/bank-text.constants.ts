/* @layer renderer-app @kind constants */
import { plural } from './plural';

const BANK_PICK_TEXT = {
  menu: 'Change palette',
  title: (count: number): string => (count === 1 ? 'Change palette of sprite' : `Change palette of ${count} sprites`),
  field: 'New palette',
  noOther: 'This file has no other palette.',
  label: (count: number): string => (count === 1 ? 'Change sprite palette' : `Change palette of ${count} sprites`),
  moving: (count: number, bank: string): string => `${plural(count, 'sprite')} will use ${bank}.`,
  skipped: (count: number): string => `${plural(count, 'picked sprite')} already ${count === 1 ? 'uses' : 'use'} it.`,
  colours: (colours: number, merged: number): string =>
    merged === 0
      ? `${plural(colours, 'colour')} in use. Each one moves to the nearest colour of the new palette.`
      : `${plural(colours, 'colour')} in use. Each one moves to the nearest colour of the new palette, so ${merged} of them become the same colour as another.`,
  noColour: 'The new palette has no colour to take the pixels.',
  nothing: 'All picked sprites use this palette already.',
} as const;

export { BANK_PICK_TEXT };
