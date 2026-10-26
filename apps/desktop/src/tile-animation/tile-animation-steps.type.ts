/* @layer renderer-app @kind types */
import type { AnimationId, TagId, TileAnimationStart } from '@bxel/document';

type TileLink = { readonly animation: AnimationId; readonly tag: TagId | null; readonly start: TileAnimationStart };

type TileStill = { readonly name: string; readonly pixels: Uint8Array };

export type { TileLink, TileStill };
