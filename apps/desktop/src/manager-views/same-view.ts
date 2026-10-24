/* @layer renderer-app @kind logic */
import type { SavedManagerView } from './manager-views.type';

const byKey = ([left]: readonly [string, unknown], [right]: readonly [string, unknown]): number => (left < right ? -1 : 1);

const sorted = (_key: string, value: unknown): unknown =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? Object.fromEntries(Object.entries(value).sort(byKey)) : value;

const sameView = (left: SavedManagerView, right: SavedManagerView): boolean => JSON.stringify(left, sorted) === JSON.stringify(right, sorted);

export { sameView };
