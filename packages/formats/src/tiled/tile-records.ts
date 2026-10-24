/* @layer core @kind logic */
import { listOf } from './list-of';
import { recOf } from './rec-of';
import type { Rec } from './rec.type';

const tileRecords = (value: unknown): Rec[] => {
  if (Array.isArray(value)) return listOf(value).map(recOf);
  return Object.entries(recOf(value)).map(([key, entry]) => ({ ...recOf(entry), id: Number(key) }));
};

export { tileRecords };
