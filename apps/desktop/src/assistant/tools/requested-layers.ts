/* @layer renderer-app @kind logic */
import type { RenderInput, TilemapSource } from './tool-input.type';

const requestedLayers = (source: TilemapSource, input: RenderInput): readonly string[] | undefined => {
  if (source.layerId === undefined && input.layers === undefined) return undefined;
  return [...(source.layerId === undefined ? [] : [source.layerId]), ...(input.layers ?? [])];
};

export { requestedLayers };
