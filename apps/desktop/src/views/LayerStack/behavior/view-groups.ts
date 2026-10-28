/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { LAYER_THUMB_SIZES } from '../../../stores/layer-view-store.constants';
import type { LayerThumbSize } from '../../../stores/layer-view-store.type';
import { LAYER_STACK_TEXT, LAYER_THUMB_TEXT } from '../LayerStack.constants';

/** The view menu of the layer list: how large the thumbnails are. */
const viewGroups = (current: LayerThumbSize, pick: (size: LayerThumbSize) => void): MenuGroup[] => [
  {
    id: 'thumbs',
    label: LAYER_STACK_TEXT.thumbSize,
    items: LAYER_THUMB_SIZES.map((size) => ({
      id: `thumb-${size}`,
      label: LAYER_THUMB_TEXT[size],
      kind: 'radio' as const,
      checked: size === current,
      onSelect: () => pick(size),
    })),
  },
];

export { viewGroups };
