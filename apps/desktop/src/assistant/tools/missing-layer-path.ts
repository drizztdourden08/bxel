/* @layer renderer-app @kind logic */
import type { TilemapSource } from './tool-input.type';

const missingLayerPath = (layers: readonly { readonly id: string }[], source: TilemapSource, wanted: readonly string[] | undefined): string | null => {
  if (!wanted?.some((id) => !layers.some((layer) => layer.id === id))) return null;
  return source.layerId === undefined ? 'layers' : 'target.layerId';
};

export { missingLayerPath };
