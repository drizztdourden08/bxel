/* @layer renderer-app @kind types */
import type { LayerThumbSize } from '../../../stores/layer-view-store.type';
import type { LayerRowModel } from '../LayerStack.type';

interface LayerLabelProps {
  row: LayerRowModel;
  active: boolean;
  picked: boolean;
  folded: boolean;
  thumbSize: LayerThumbSize;
  follow: boolean;
  onRename: (name: string) => string | null;
}

export type { LayerLabelProps };
