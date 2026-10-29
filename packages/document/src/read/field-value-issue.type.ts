/* @layer core @kind types */
import type { FieldValue, TileField } from '../model/tilemap.type';

type FieldRule = (field: TileField, value: FieldValue) => string | null;

export type { FieldRule };
