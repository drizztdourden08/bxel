/* @layer core @kind logic */
import type { PaletteBank } from '@bxel/document';
import { autoTable } from './auto-table';

const darkerTable = (bank: PaletteBank): Uint8Array => autoTable(bank, 'down', 1);

export { darkerTable };
