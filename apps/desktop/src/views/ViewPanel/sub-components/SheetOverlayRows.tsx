/* @layer renderer-app @kind component */
import { useAssetView } from '../../../asset-view/useAssetView';
import { OVERLAY_TEXT } from '../ViewPanel.constants';
import { OverlayRow } from './OverlayRow';

const SheetOverlayRows = () => {
  const asset = useAssetView();
  return (
    <>
      <OverlayRow label={OVERLAY_TEXT.labels} description={OVERLAY_TEXT.labelsDescription} checked={asset.view.labels} onChange={(labels) => asset.patch({ labels })} />
      <OverlayRow label={OVERLAY_TEXT.overlaps} description={OVERLAY_TEXT.overlapsDescription} checked={asset.view.overlaps} onChange={(overlaps) => asset.patch({ overlaps })} />
      <OverlayRow label={OVERLAY_TEXT.pivots} description={OVERLAY_TEXT.pivotsDescription} checked={asset.view.pivots} onChange={(pivots) => asset.patch({ pivots })} />
    </>
  );
};

export { SheetOverlayRows };
