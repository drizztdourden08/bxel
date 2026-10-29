/* @layer core @kind types */
import type { FieldValue, Tile } from '../../model/tilemap.type';

type DataChange = Readonly<Record<string, FieldValue | null>>;

type PlainChange = { type?: string | null; probability?: number | null; turns?: Tile['turns'] | null };

export type { DataChange, PlainChange };
