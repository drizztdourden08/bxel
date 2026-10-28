/* @layer renderer-app @kind component */
import { Box, EmptyState } from '@drizztdourden08/tessera';
import { DEFAULT_LOOP, PREVIEW_TEXT } from '../../asset-preview/asset-preview.constants';
import type { AssetPreviewProps } from './AssetPreview.type';
import { FramesPreview } from './sub-components/FramesPreview';
import { PixelStage } from './sub-components/PixelStage';
import { SwatchGrid } from './sub-components/SwatchGrid';
import './AssetPreview.css';

const AssetPreview = ({ preview, name, loop = DEFAULT_LOOP, mode = 'large' }: AssetPreviewProps) => (
  <Box className={`asset-preview asset-preview--${mode}`}>
    {preview.kind === 'frames' && <FramesPreview frames={preview.frames} name={name} loop={loop} mode={mode} />}
    {preview.kind === 'image' && <PixelStage image={preview.image} label={name} mode={mode} />}
    {preview.kind === 'swatches' && <SwatchGrid colours={preview.colours} name={name} mode={mode} />}
    {preview.kind === 'none' && <EmptyState size="sm" title={name} message={PREVIEW_TEXT.none} />}
  </Box>
);

export { AssetPreview };
