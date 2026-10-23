/* @layer core @kind types */
import type { FrameId, LayerId, SpriteId } from '../model/ids.type';

type SpriteRef = SpriteId | { readonly ref: string };

type LayerSelector =
  | { readonly by: 'ids'; readonly ids: readonly LayerId[] }
  | { readonly by: 'names'; readonly names: readonly string[] }
  | { readonly by: 'all' };

type FrameSelector =
  | { readonly by: 'ids'; readonly ids: readonly FrameId[] }
  | { readonly by: 'range'; readonly from: number; readonly to: number }
  | { readonly by: 'tag'; readonly name: string }
  | { readonly by: 'all' };

type TargetScope = {
  readonly sprites: readonly SpriteRef[];
  readonly layers: LayerSelector;
  readonly frames: FrameSelector;
};

export type { FrameSelector, LayerSelector, SpriteRef, TargetScope };
