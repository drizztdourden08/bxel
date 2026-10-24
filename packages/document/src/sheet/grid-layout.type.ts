/* @layer core @kind types */
import type { SheetLayout } from '../model/sheet.type';

type GridLayout = Extract<SheetLayout, { kind: 'grid' }>;

export type { GridLayout };
