/* @layer renderer-app @kind types */
import type { Rect } from '@bxel/document';

type CellBox = { readonly x: number; readonly y: number; readonly width: number; readonly height: number; readonly rotated: boolean; readonly source: Rect };

export type { CellBox };
