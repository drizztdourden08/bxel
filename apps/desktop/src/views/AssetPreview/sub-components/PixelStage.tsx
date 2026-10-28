/* @layer renderer-app @kind component */
import { Box, Canvas, Text } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import { PREVIEW_TEXT } from '../../../asset-preview/asset-preview.constants';
import { usePaintImage } from '../../../asset-preview/usePaintImage';
import { fitZoom } from '../behavior/fit-zoom';
import { useStageSize } from '../behavior/useStageSize';
import type { PixelStageProps } from '../AssetPreview.type';

const PixelStage = ({ image, label }: PixelStageProps) => {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const size = useStageSize(stage);
  const zoom = fitZoom(size, image.width, image.height);

  usePaintImage(canvas, image);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    element.style.inlineSize = `${image.width * zoom}px`;
    element.style.blockSize = `${image.height * zoom}px`;
  }, [image.width, image.height, zoom]);

  return (
    <Box ref={stage} className="asset-preview__stage pixel-checker">
      <Canvas ref={canvas} className="asset-preview__canvas" role="img" aria-label={label} />
      <Text as="span" variant="caption" tone="muted" className="asset-preview__zoom">
        {PREVIEW_TEXT.zoom(zoom)}
      </Text>
    </Box>
  );
};

export { PixelStage };
