/* @layer core @kind types */
import type { JsonValue, SheetTagEntry } from './sheet-metadata.type';

type TileEntry = { readonly id: number; readonly json: JsonValue };

type TagRun = { readonly name: string; readonly tag: SheetTagEntry | null; readonly order: readonly number[] };

export type { TagRun, TileEntry };
