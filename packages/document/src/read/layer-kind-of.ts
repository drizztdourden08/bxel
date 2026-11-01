/* @layer core @kind logic */
import type { Layer, LayerKind } from '../model/sprite.type';

const layerKindOf = (layer: Pick<Layer, 'kind'>): LayerKind => layer.kind ?? 'pixel';

export { layerKindOf };
