/* @layer renderer-app @kind logic */
import { layerKindOf, viewAlpha } from '@bxel/document';
import type { FrameView, LayerId, Sprite } from '@bxel/document';
import { useReferenceStore } from '../stores/useReferenceStore';
import { DIMMED_ALPHA } from './frame-view.constants';
import { requestReference } from './request-reference';

const frameView = (sprite: Sprite, highlight: LayerId | null): FrameView | undefined => {
  const { layers } = sprite;
  const references = layers.filter((layer) => layerKindOf(layer) === 'reference' && layer.reference !== undefined);
  const faded = layers.some((layer) => viewAlpha(layers, layer) < 1);
  if (references.length === 0 && !faded && highlight === null) return undefined;
  references.forEach((layer) => layer.reference && requestReference(layer.reference.path));
  const { entries } = useReferenceStore.getState();
  return {
    alpha: (layer) => viewAlpha(layers, layer) * (highlight === null || layer.id === highlight ? 1 : DIMMED_ALPHA),
    reference: (layer) => {
      const entry = layer.reference ? entries[layer.reference.path] : undefined;
      return entry?.state === 'ready' ? entry.picture : null;
    },
  };
};

export { frameView };
