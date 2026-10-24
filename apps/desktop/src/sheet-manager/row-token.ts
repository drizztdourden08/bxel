/* @layer renderer-app @kind logic */
import { ROW_BUCKETS } from './virtual-grid.constants';

const rowToken = (zoom: number): number => (ROW_BUCKETS.find((bucket) => zoom <= bucket.upTo) ?? ROW_BUCKETS[ROW_BUCKETS.length - 1])?.token ?? 192;

export { rowToken };
