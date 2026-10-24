/* @layer core @kind types */
import type { Point, Rect } from '../model/geometry.type';

type EntryPlace = { readonly at?: Point | undefined; readonly source?: Rect | null | undefined };

export type { EntryPlace };
