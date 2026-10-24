/* @layer core @kind logic */
import type { Rec } from './rec.type';
import { EMPTY_REC } from './tiled.constants';

const recOf = (value: unknown): Rec => (typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Rec) : EMPTY_REC);

export { recOf };
