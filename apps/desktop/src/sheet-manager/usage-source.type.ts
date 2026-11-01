/* @layer renderer-app @kind types */
import type { AnimationId, SheetId, SpriteId } from '@bxel/document';

interface UsageSource {
  readonly animations: readonly {
    readonly name: string;
    readonly frames: readonly { readonly spriteId: SpriteId | null }[];
  }[];
  readonly tilesets: readonly {
    readonly name: string;
    readonly tiles: readonly { readonly spriteId: SpriteId; readonly animation?: { readonly animationId: AnimationId } }[];
  }[];
  readonly sheets: readonly {
    readonly id: SheetId;
    readonly name: string;
    readonly entries: readonly { readonly spriteId: SpriteId }[];
    readonly animationEntries?: readonly { readonly animationId: AnimationId }[];
  }[];
}

export type { UsageSource };
