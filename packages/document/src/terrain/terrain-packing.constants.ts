/* @layer core @kind constants */
import type { TerrainPacking } from './terrain-packing.type';

const PACKINGS: readonly TerrainPacking[] = [
  { id: 'blob47-7', kind: 'blob47', label: '7 wide', columns: 7, rows: 7 },
  { id: 'blob47-6', kind: 'blob47', label: '6 wide', columns: 6, rows: 8 },
  { id: 'blob47-12', kind: 'blob47', label: '12 wide', columns: 12, rows: 4 },
  { id: 'blob16-4', kind: 'blob16', label: '4 wide', columns: 4, rows: 4 },
  { id: 'blob16-8', kind: 'blob16', label: '8 wide', columns: 8, rows: 2 },
  { id: 'corner16-4', kind: 'corner16', label: '4 wide', columns: 4, rows: 4 },
  { id: 'corner16-8', kind: 'corner16', label: '8 wide', columns: 8, rows: 2 },
];

export { PACKINGS };
