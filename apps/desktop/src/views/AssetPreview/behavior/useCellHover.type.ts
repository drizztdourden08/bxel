/* @layer renderer-app @kind types */
import type { MouseEvent } from 'react';
import type { PreviewCell } from '../../../asset-overview/asset-overview.type';

type CellHover = {
  readonly cell: PreviewCell | null;
  readonly onMove: (event: MouseEvent<HTMLCanvasElement>) => void;
  readonly onLeave: () => void;
};

export type { CellHover };
