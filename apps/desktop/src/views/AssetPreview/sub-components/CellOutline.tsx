/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import type { CellOutlineProps } from '../AssetPreview.type';

const CellOutline = ({ cell, zoom }: CellOutlineProps) => {
  const outline = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = outline.current;
    if (!element || cell === null) return;
    element.style.insetInlineStart = `${cell.x * zoom}px`;
    element.style.insetBlockStart = `${cell.y * zoom}px`;
    element.style.inlineSize = `${cell.width * zoom}px`;
    element.style.blockSize = `${cell.height * zoom}px`;
  }, [cell, zoom]);
  return cell === null ? null : <Box ref={outline} className="asset-preview__cell" aria-hidden="true" />;
};

export { CellOutline };
