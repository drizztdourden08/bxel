/* @layer core @kind types */
import type { CommandWarning } from '../commands/result.type';
import type { CelId, FrameId, LayerId, SpriteId } from '../model/ids.type';
import type { Artwork } from '../model/artwork.type';
import type { Layer, Sprite } from '../model/sprite.type';
import type { FrameSelector, LayerSelector, SpriteRef, TargetScope } from './target-scope.type';

type ResolvedCel = {
  readonly spriteId: SpriteId;
  readonly layerId: LayerId;
  readonly frameId: FrameId;
  readonly celId: CelId | null;
};

type ResolvedScope = {
  readonly sprites: readonly SpriteId[];
  readonly cels: readonly ResolvedCel[];
  readonly warnings: readonly CommandWarning[];
};

type ResolveScopeInput = {
  readonly artwork: Artwork;
  readonly scope: TargetScope;
  readonly created: Readonly<Record<string, string>>;
  readonly step: number;
};

type ResolveSpritesInput = {
  readonly artwork: Artwork;
  readonly refs: readonly SpriteRef[];
  readonly created: Readonly<Record<string, string>>;
};

type ResolveLayersInput = {
  readonly sprite: Sprite;
  readonly selector: LayerSelector;
  readonly step: number;
};

type ResolveFramesInput = {
  readonly sprite: Sprite;
  readonly selector: FrameSelector;
};

type LayerPick = { readonly layers: readonly Layer[]; readonly warnings: readonly CommandWarning[] };

type SpriteCels = { readonly cels: readonly ResolvedCel[]; readonly warnings: readonly CommandWarning[] };

export type {
  LayerPick,
  ResolveFramesInput,
  ResolveLayersInput,
  ResolveScopeInput,
  ResolveSpritesInput,
  ResolvedCel,
  ResolvedScope,
  SpriteCels,
};
