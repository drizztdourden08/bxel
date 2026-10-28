/* @layer renderer-app @kind component */
import { Box, Canvas, Text } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import { PREVIEW_TEXT } from '../../../asset-preview/asset-preview.constants';
import { fitZoom } from '../behavior/fit-zoom';
import { useStageSize } from '../behavior/useStageSize';
import type { PixelStageProps } from '../AssetPreview.type';

const PixelStage = ({ image, label }: PixelStageProps) => {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const size = useStageSize(stage);
  const zoom = fitZoom(size, image.width, image.height);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context) return;
    element.width = image.width;
    element.height = image.height;
    context.putImageData(new ImageData(new Uint8ClampedArray(image.data), image.width, image.height), 0, 0);
  }, [image]);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    element.style.inlineSize = `${image.width * zoom}px`;
    element.style.blockSize = `${image.height * zoom}px`;
  }, [image.width, image.height, zoom]);

  return (
    <Box ref={stage} className="asset-preview__stage">
      <Canvas ref={canvas} className="asset-preview__canvas" role="img" aria-label={label} />
      <Text as="span" variant="caption" tone="muted" className="asset-preview__zoom">
        {PREVIEW_TEXT.zoom(zoom)}
      </Text>
    </Box>
  );
};

export { PixelStage };
