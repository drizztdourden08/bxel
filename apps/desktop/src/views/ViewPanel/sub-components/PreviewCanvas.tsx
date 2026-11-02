/* @layer renderer-app @kind component */
import { Box, Canvas, Text } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import { useAssetView } from '../../../asset-view/useAssetView';
import { paintPreview } from '../behavior/paint-preview';
import { usePreviewImage } from '../behavior/usePreviewImage';
import { PREVIEW_TEXT } from '../ViewPanel.constants';
import type { PreviewCanvasProps } from '../ViewPanel.type';

const PreviewCanvas = ({ scale }: PreviewCanvasProps) => {
  const image = usePreviewImage();
  const { view } = useAssetView();
  const background = view.background === 'solid' ? view.backgroundColour : null;
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvas.current && image) paintPreview(canvas.current, image, scale, background);
  }, [image, scale, background]);
  if (!image) return <Text variant="caption" tone="muted">{PREVIEW_TEXT.empty}</Text>;
  return (
    <Box className="view-panel__preview">
      <Canvas ref={canvas} className="view-panel__preview-art" role="img" aria-label={PREVIEW_TEXT.image} />
    </Box>
  );
};

export { PreviewCanvas };
