/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { lookAt } from './look-at';

const validSwatch = (bank: PaletteBank, index: number): boolean => index > 0 && lookAt(bank, index) !== null;

export { validSwatch };
