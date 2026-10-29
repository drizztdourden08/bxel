/* @layer renderer-app @kind logic */
import { resizeActiveSprite } from '../../canvas-size/resize-active-sprite';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { addLayer } from '../add-layer';
import { currentTarget } from '../current-target';
import { clipInto } from './clip-into';
import type { PasteMode } from './paste-mode.type';
import { selectionMask } from './selection-mask';

const prepareFor = (mode: PasteMode): void => {
  const store = useSelectionStore.getState();
  const target = currentTarget();
  const clip = store.clipboard;
  if (!target || !clip) return;
  if (mode === 'layer') addLayer();
  if (mode === 'expand') {
    resizeActiveSprite({ width: Math.max(target.sprite.width, clip.origin.x + clip.width), height: Math.max(target.sprite.height, clip.origin.y + clip.height), anchor: 'top-left' });
  }
  const mask = mode === 'selection' ? selectionMask(target) : null;
  if (mask) store.setClipboard(clipInto(clip, mask));
};

export { prepareFor };
