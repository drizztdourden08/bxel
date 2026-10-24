/* @layer core @kind data */
import type { FlatPresetSpec } from '../model/preset.type';

const GENERIC_SPECS: readonly FlatPresetSpec[] = [
  { id: 'generic-1bit', size: 2 },
  { id: 'generic-4', size: 4 },
  { id: 'generic-16', size: 16 },
  { id: 'generic-32', size: 32 },
  { id: 'generic-256', size: 256 },
];

export { GENERIC_SPECS };
