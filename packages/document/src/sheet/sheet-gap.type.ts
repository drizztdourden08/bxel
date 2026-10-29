/* @layer core @kind types */
import type { Sheet } from '../model/sheet.type';

type SheetGap = Pick<Sheet, 'spacing' | 'margin'>;

export type { SheetGap };
