/* @layer core @kind types */
import type { SheetTagEntry } from './sheet-metadata.type';

type SheetTagStyle = Pick<SheetTagEntry, 'direction' | 'repeat' | 'colour' | 'facing'>;

export type { SheetTagStyle };
