/* @layer renderer-app @kind component */
import { Box, Canvas, Text } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import { PREVIEW_TEXT } from '../../../asset-preview/asset-preview.constants';
import { usePaintImage } from '../../../asset-preview/usePaintImage';
import { fitZoom } from '../behavior/fit-zoom';
import { useCellHover } from '../behavior/useCellHover';
import { useStageSize } from '../behavior/useStageSize';
import type { PixelStageProps } from '../AssetPreview.type';
import { CellOutline } from './CellOutline';

const PixelStage = ({ image, label, cells }: PixelStageProps) => {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const size = useStageSize(stage);
  const zoom = fitZoom(size, image.width, image.height);
  const hover = useCellHover(cells, zoom);

  usePaintImage(canvas, image);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    element.style.inlineSize = `${image.width * zoom}px`;
    element.style.blockSize = `${image.height * zoom}px`;
  }, [image.width, image.height, zoom]);

  return (
    <Box ref={stage} className="asset-preview__stage pixel-checker">
      <Box className="asset-preview__frame">
        <Canvas ref={canvas} className="asset-preview__canvas" role="img" aria-label={label} onMouseMove={hover.onMove} onMouseLeave={hover.onLeave} />
        <CellOutline cell={hover.cell} zoom={zoom} />
      </Box>
      <Text as="span" variant="caption" tone="muted" className="asset-preview__zoom">
        {PREVIEW_TEXT.zoom(zoom)}
      </Text>
    </Box>
  );
};

export { PixelStage };
