/* @layer renderer-app @kind types */
import type { AssetRow } from './asset-list.type';

type Compare = (left: AssetRow, right: AssetRow) => number;

export type { Compare };
