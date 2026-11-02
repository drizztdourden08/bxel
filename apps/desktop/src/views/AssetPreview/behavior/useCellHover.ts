/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { MouseEvent } from 'react';
import type { PreviewCell } from '../../../asset-overview/asset-overview.type';

type CellHover = {
  readonly cell: PreviewCell | null;
  readonly onMove: (event: MouseEvent<HTMLCanvasElement>) => void;
  readonly onLeave: () => void;
};

const useCellHover = (cells: readonly PreviewCell[] | undefined, zoom: number): CellHover => {
  const [cell, setCell] = useState<PreviewCell | null>(null);
  return {
    cell,
    onLeave: () => setCell(null),
    onMove: (event) => {
      if (cells === undefined || zoom <= 0) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / zoom;
      const y = (event.clientY - bounds.top) / zoom;
      const found = [...cells].reverse().find((each) => x >= each.x && x < each.x + each.width && y >= each.y && y < each.y + each.height) ?? null;
      setCell(found);
    },
  };
};

export { useCellHover };
