/* @layer renderer-app @kind constants */
import { ASSET_VIEW_DEFAULTS } from '../asset-view/asset-view.constants';
import { zoomView } from '../editor/zoom-view';
import { clearGuideColours } from '../guides/clear-guide-colours';
import { PREVIEW_DEFAULTS } from '../stores/preview-store.constants';
import { ONION_DEFAULTS } from '../stores/timeline-store.constants';
import { VIEW_DEFAULTS } from '../stores/view-store.constants';
import { usePreviewStore } from '../stores/usePreviewStore';
import { useTimelineStore } from '../stores/useTimelineStore';
import { useToolStore } from '../stores/useToolStore';
import { useViewStore } from '../stores/useViewStore';
import { patchCurrentView } from './patch-current-view';
import type { ViewSectionId } from './view-section.type';

const { grid, gridMajor, gridTile, gridIso, hideOverlays, snap, guides, rulers, lockGuides } = VIEW_DEFAULTS;

const SECTION_RESETS: Readonly<Partial<Record<ViewSectionId, () => void>>> = {
  zoom: () => zoomView('fit'),
  preview: () => usePreviewStore.setState({ scale: PREVIEW_DEFAULTS.scale, onCanvas: PREVIEW_DEFAULTS.onCanvas }),
  overlays: () => {
    useViewStore.getState().setToggles({ grid, gridMajor, gridTile, gridIso, hideOverlays, snap });
    const { tileGrid, majorEvery, labels, overlaps, pivots } = ASSET_VIEW_DEFAULTS;
    patchCurrentView({ tileGrid, majorEvery, labels, overlaps, pivots });
  },
  guides: () => {
    useViewStore.getState().setToggles({ guides, rulers, lockGuides });
    clearGuideColours();
  },
  onion: () => useTimelineStore.getState().setOnion(ONION_DEFAULTS),
  tiled: () => useViewStore.getState().setTiled('off'),
  symmetry: () => {
    useToolStore.getState().setAxis('x', null);
    useToolStore.getState().setAxis('y', null);
  },
  background: () => patchCurrentView({ background: ASSET_VIEW_DEFAULTS.background, backgroundColour: ASSET_VIEW_DEFAULTS.backgroundColour }),
};

export { SECTION_RESETS };
