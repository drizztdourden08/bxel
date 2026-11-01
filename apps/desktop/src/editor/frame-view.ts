/* @layer renderer-app @kind logic */
import { layerKindOf, viewAlpha } from '@bxel/document';
import type { FrameView, Sprite } from '@bxel/document';
import { useReferenceStore } from '../stores/useReferenceStore';
import { requestReference } from './request-reference';

const frameView = (sprite: Sprite): FrameView | undefined => {
  const { layers } = sprite;
  const references = layers.filter((layer) => layerKindOf(layer) === 'reference' && layer.reference !== undefined);
  const faded = layers.some((layer) => viewAlpha(layers, layer) < 1);
  if (references.length === 0 && !faded) return undefined;
  references.forEach((layer) => layer.reference && requestReference(layer.reference.path));
  const { entries } = useReferenceStore.getState();
  return {
    reference: (layer) => {
      const entry = layer.reference ? entries[layer.reference.path] : undefined;
      return entry?.state === 'ready' ? entry.picture : null;
    },
  };
};

export { frameView };
