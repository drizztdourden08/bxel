/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import type { ImageTab } from '../../../stores/image-tab-store.type';
import type { SharedView } from '../../ImagePreview/ImagePreview.type';
import { IMAGE_MENU, IMAGE_ZOOM } from '../ImageStage.constants';
import { copyImageTab } from './copy-image-tab';

const zoomTo = (view: SharedView, factor: number): void => {
  const next = (view.zoom ?? IMAGE_ZOOM.actual) * factor;
  view.onZoomChange(Math.min(IMAGE_ZOOM.max, Math.max(IMAGE_ZOOM.min, next)));
};

const imageMenuEntries = (tab: ImageTab, view: SharedView): readonly ContextMenuEntry[] => [
  { label: IMAGE_MENU.copy, run: () => void copyImageTab(tab) },
  { command: 'image.import', label: 'Import...' },
  'separator',
  { label: IMAGE_MENU.zoomIn, run: () => zoomTo(view, IMAGE_ZOOM.factor) },
  { label: IMAGE_MENU.zoomOut, run: () => zoomTo(view, 1 / IMAGE_ZOOM.factor) },
  { label: IMAGE_MENU.actualSize, run: () => view.onZoomChange(IMAGE_ZOOM.actual) },
];

export { imageMenuEntries };
