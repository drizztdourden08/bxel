/* @layer renderer-app @kind logic */
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerRowModel } from '../LayerStack.type';

interface LayerBadge {
  id: 'missing' | 'opacity' | 'clip' | 'export';
  text: string;
  title: string;
}

const layerBadges = (row: LayerRowModel): LayerBadge[] => [
  ...(row.missing ? [{ id: 'missing' as const, text: LAYER_STACK_TEXT.missingBadge, title: LAYER_STACK_TEXT.missingBadge }] : []),
  ...(row.viewOpacity < 100 ? [{ id: 'opacity' as const, text: LAYER_STACK_TEXT.fadedBadge(row.viewOpacity), title: LAYER_STACK_TEXT.opacity }] : []),
  ...(row.clip ? [{ id: 'clip' as const, text: LAYER_STACK_TEXT.clippedBadge, title: LAYER_STACK_TEXT.clipHint }] : []),
  ...(!row.exported && row.kind !== 'reference' ? [{ id: 'export' as const, text: LAYER_STACK_TEXT.hiddenFromExport, title: LAYER_STACK_TEXT.exportHint }] : []),
];

export { layerBadges };
export type { LayerBadge };
