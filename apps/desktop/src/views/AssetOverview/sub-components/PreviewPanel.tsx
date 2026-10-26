/* @layer renderer-app @kind component */
import { PanelContainer, Text } from '@drizztdourden08/tessera';
import { OVERVIEW_TEXT } from '../../../asset-overview/asset-overview.constants';
import type { OverviewPartProps } from '../AssetOverview.type';
import { FramePreview } from './FramePreview';
import { PixelCanvas } from './PixelCanvas';
import { SwatchPreview } from './SwatchPreview';

const PreviewPanel = ({ model }: OverviewPartProps) => {
  const { preview, name } = model;
  return (
    <PanelContainer title={OVERVIEW_TEXT.previewTitle} level={3}>
      {preview.kind === 'frames' && <FramePreview key={model.focus.key.id} frames={preview.frames} name={name} />}
      {preview.kind === 'image' && <PixelCanvas image={preview.image} label={OVERVIEW_TEXT.previewLabel(name)} />}
      {preview.kind === 'swatches' && <SwatchPreview colours={preview.colours} name={name} />}
      {preview.kind === 'none' && <Text tone="muted">{OVERVIEW_TEXT.noPreview}</Text>}
    </PanelContainer>
  );
};

export { PreviewPanel };
