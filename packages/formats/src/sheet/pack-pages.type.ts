/* @layer core @kind types */
import type { PackedSheet } from './sheet.type';

type OpenPage = {
  groups: number[];
  packed: PackedSheet | null;
};

export type { OpenPage };
