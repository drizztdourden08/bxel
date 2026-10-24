/* @layer core @kind types */
import type { TiledLayer } from './tiled.type';

type Inherited = { readonly path: string; readonly visible: boolean; readonly opacity: number; readonly depth: number };

type Collected = { readonly layers: TiledLayer[]; skipped: number };

type LayerSpace = { readonly count: number; readonly inherited: Inherited };

export type { Collected, LayerSpace };
